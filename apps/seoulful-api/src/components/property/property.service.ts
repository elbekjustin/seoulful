import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { Properties, Property } from '../../libs/dto/property/property';
import { Direction, Message } from '../../libs/enums/common.enum';
import {
  AgentPropertiesInquiry,
  AllPropertiesInquiry,
  OrdinaryInquiry,
  PropertiesInquiry,
  PropertyInput,
} from '../../libs/dto/property/property.input';
import { MemberService } from '../member/member.service';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import * as moment from 'moment';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { EmbeddingService } from '../embedding/embedding.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel('Property') private readonly propertyModel: Model<Property>,
    private memberService: MemberService,
    private viewService: ViewService,
    private likeService: LikeService,
    private embeddingService: EmbeddingService,
  ) {}

public async createProperty(input: PropertyInput): Promise<Property> {
  try {
    // 1. Embeddingni yaratamiz
    const fullText = `${input.propertyTitle} ${input.propertyAddress} ${input.recommended?.join(' ')} ${input.atmosphere?.join(' ')}`;
    const embedding = await this.embeddingService.generateEmbedding(fullText);

    // 2. Inputga qo‘shib yuboramiz
    const result = await this.propertyModel.create({
      ...input,
      embedding, // Yangi embedding ni joylashtiramiz
    });

    // 3. Member statistikasi yangilanadi
    await this.memberService.memberStatusEditor({
      _id: result.memberId,
      targetKey: 'memberProperties',
      modifier: 1,
    });

    return result;
  } catch (err) {
    console.log('Error, Service.model:', err.message);
    throw new BadRequestException(Message.CREATE_FAILED);
  }
}


  public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> {
    const search: T = {
      _id: propertyId,
      propertyStatus: PropertyStatus.ACTIVE,
    };

    const targetProperty: Property = await this.propertyModel.findOne(search).exec();
    if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    if (memberId) {
      const viewInput = { memberId: memberId, viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY };
      const newView = await this.viewService.recordView(viewInput);
      if (newView) {
        await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
        targetProperty.propertyViews++;
      }

      const likeInput: LikeInput = {
        memberId: memberId,
        likeRefId: propertyId,
        likeGroup: LikeGroup.PROPERTY,
        likeOwnerId: targetProperty.memberId,
      };
      targetProperty.meLiked = await this.likeService.checkLikeExistence(likeInput);
      // me follewed
    }

    targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
    return targetProperty;
  }

  public async updateProperty(memberId: ObjectId, input: PropertyUpdate): Promise<Property> {
    let { propertyStatus, hiddenAt, deletedAt } = input;
    const search: T = {
      _id: input._id,
      memberId: memberId,
    };

    if (propertyStatus === PropertyStatus.HIDDEN) hiddenAt = moment().toDate();
    else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

    const result = await this.propertyModel
      .findOneAndUpdate(search, input, {
        new: true,
      })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (hiddenAt || deletedAt) {
      await this.memberService.memberStatusEditor({
        _id: memberId,
        targetKey: 'memberProperties',
        modifier: -1,
      });
    }

    return result;
  }

  public async getProperties(memberId: ObjectId, input: PropertiesInquiry): Promise<Properties> {
    const match: T = { propertyStatus: PropertyStatus.ACTIVE };
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

    this.shapeMatchQuery(match, input);
    console.log('match:', match);

    const result = await this.propertyModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              // meLiked
              lookupAuthMemberLiked(memberId),
              lookupMember,
              { $unwind: '$memberData' }, // memberData => memberData
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    // console.log(JSON.stringify(result, null, 2));

    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

  private shapeMatchQuery(match: T, input: PropertiesInquiry): void {
    const { memberId, locationList, atmosphereList, recommendedList, typeList, options, text } = input.search;

    if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
    if (locationList && locationList.length) match.propertyLocation = { $in: locationList };
    if (atmosphereList && atmosphereList.length) match.atmosphere = { $in: atmosphereList };
    if (recommendedList && recommendedList.length) match.recommended = { $in: recommendedList };

    if (typeList) match.propertyType = { $in: Array.isArray(typeList) ? typeList : [typeList] };

    if (text) match.propertyTitle = { $regex: new RegExp(text, 'i') };

    if (options?.length) {
      match['$or'] = options.map((ele) => {
        return { [ele]: true };
      });
    }
  }

  public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
    return await this.likeService.getFavoriteProperties(memberId, input);
  }

  public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
    return await this.viewService.getVisitedProperties(memberId, input);
  }

  public async getAgentProperties(memberId: ObjectId, input: AgentPropertiesInquiry): Promise<Properties> {
    const { propertyStatus } = input.search;

    if (propertyStatus === PropertyStatus.DELETE) {
      throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);
    }

    const match: T = {
      memberId: memberId,
      propertyStatus: propertyStatus ?? { $ne: PropertyStatus.DELETE },
    };

    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

    const result = await this.propertyModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) {
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    }
    console.log('result:', result);

    return result[0];
  }

  /** LIKE **/

public async likeTargetProperty(memberId: ObjectId, likeRefId: ObjectId): Promise<Property> {
  const target: Property = await this.propertyModel
    .findOne({
      _id: likeRefId,
      propertyStatus: PropertyStatus.ACTIVE,
    })
    .exec();

  if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

  const input: LikeInput = {
    memberId: memberId,
    likeRefId: likeRefId,
    likeGroup: LikeGroup.PROPERTY,
    likeOwnerId: target.memberId,
  };

  const modifier: number = await this.likeService.toggleLike(input);

  const updated = await this.propertyStatsEditor({
    _id: likeRefId,
    targetKey: 'propertyLikes',
    modifier: modifier,
  });

  // 🛠️ YANGI QO‘SHILADIGAN QISM:
  if (updated) {
    updated.meLiked = await this.likeService.checkLikeExistence(input);  // Like holatini ham qaytaramiz
  }

  return updated;
}


  /** ADMIN **/

  public async getAllPropertiesByAdmin(input: AllPropertiesInquiry): Promise<Properties> {
    const { propertyStatus, propertyLocationList } = input.search;
    const match: T = {};
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

    if (propertyStatus) match.propertyStatus = propertyStatus;
    if (propertyLocationList) match.propertyLocation = { $in: propertyLocationList };

    const result = await this.propertyModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();

    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }

public async updatePropertyByAdmin(memberId: ObjectId, input: PropertyUpdate): Promise<Property> {
  let { propertyStatus } = input;
  const { _id } = input;

  const updateData: any = {
    propertyStatus,
  };

  if (propertyStatus === PropertyStatus.HIDDEN) {
    updateData.hiddenAt = moment().toDate();
    updateData.deletedAt = undefined;
  } else if (propertyStatus === PropertyStatus.DELETE) {
    updateData.deletedAt = moment().toDate();
    updateData.hiddenAt = undefined;
  } else if (propertyStatus === PropertyStatus.ACTIVE) {
    updateData.hiddenAt = undefined;
    updateData.deletedAt = undefined;
  }

  const result = await this.propertyModel.findOneAndUpdate(
    { _id },
    updateData,
    { new: true }
  ).exec();

  if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

  return result;
}


  public async removePropertyByAdmin(propertyId: ObjectId): Promise<Property> {
    const search: T = { _id: propertyId, propertyStatus: PropertyStatus.DELETE };
    const result = await this.propertyModel.findOneAndDelete(search).exec();
    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
    return result;
  }

  public async propertyStatsEditor(input: StatisticModifier): Promise<Property> {
    const { _id, targetKey, modifier } = input;
    return await this.propertyModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
  }


// AI API integration


  public async updateAllEmbeddings() {
  const properties = await this.propertyModel.find({ embedding: { $exists: false } }); // faqat embedding yo‘qlar

  for (const property of properties) {
    const text = `${property.propertyTitle} ${property.propertyAddress} ${property.recommended?.join(' ')} ${property.atmosphere?.join(' ')}`;
    try {
      const embedding = await this.embeddingService.generateEmbedding(text);
      await this.propertyModel.updateOne(
        { _id: property._id },
        { $set: { embedding } }
      );
      console.log(`✅ Updated: ${property.propertyTitle}`);
    } catch (err) {
      console.error(`❌ Error on ${property._id}:`, err.message);
    }
  }

  return `Updated ${properties.length} properties`;
}


public async recommendSimilarProperties(inputText: string, topK = 5): Promise<Property[]> {
  const embedding = await this.embeddingService.generateEmbedding(inputText);

  // Cosine similarity ni hisoblaymiz (approximate: $dotProduct)
  const similarProperties = await this.propertyModel
    .aggregate([
      {
        $addFields: {
          similarity: {
            $let: {
              vars: {
                dotProduct: {
                  $sum: {
                    $map: {
                      input: { $range: [0, 1536] },
                      as: 'i',
                      in: {
                        $multiply: [
                          { $arrayElemAt: ['$embedding', '$$i'] },
                          { $arrayElemAt: [embedding, '$$i'] },
                        ],
                      },
                    },
                  },
                },
              },
              in: '$$dotProduct',
            },
          },
        },
      },
      { $sort: { similarity: -1 } },
      { $limit: topK },
    ])
    .exec();

  return similarProperties;
}


}




