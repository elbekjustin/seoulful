import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { InjectModel } from '@nestjs/mongoose';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { Properties } from '../../libs/dto/property/property';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class LikeService {
    constructor(@InjectModel('Like') private readonly likeModel: Model<Like>,
    private readonly notificationService: NotificationService,
    ) {}

  public async toggleLike(input: LikeInput): Promise<number> {
    const search: T = { 
      memberId: input.memberId, 
      likeRefId: input.likeRefId,
       },
    exist = await this.likeModel.findOne(search).exec();
  let modifier = 1;

  if (exist) {
      await this.likeModel.findOneAndDelete(search).exec();
      modifier = -1;
  } else {
      try {

      await this.likeModel.create(input);

        console.log('📩 Notification yaratilyapti:', {
        receiverId: input.likeOwnerId.toString(), // bu maydonni LikeInput ichiga qo‘shgan bo‘lishing kerak!
        authorId: input.memberId.toString(),
        });

      await this.notificationService.createNotification({
        notificationType: NotificationType.LIKE,
        notificationGroup: input.likeGroup as any, // yoki `as NotificationGroup`, agar enumlar mos bo‘lsa
        notificationTitle: 'New like',
        notificationDesc: 'Someone liked your content',
        receiverId: input.likeOwnerId.toString(), // bu maydonni LikeInput ichiga qo‘shgan bo‘lishing kerak!
        authorId: input.memberId.toString(),
        propertyId: input.likeGroup === LikeGroup.PROPERTY ? input.likeRefId.toString() : undefined,
        articleId: input.likeGroup === LikeGroup.ARTICLE ? input.likeRefId.toString() : undefined,
      });


      } catch (err) {
      console.log('Error, Service.model:', err.message); // qachon error hosil bo'ladi ?
      throw new BadRequestException(Message.CREATE_FAILED);
      }
  }

  console.log(`- Like modifier ${modifier}, -`);
  return modifier;
  }

  public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]> {
    const { memberId, likeRefId } = input;
    const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
    return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
  }

  public async getFavoriteProperties(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
    const { page, limit } = input;
   const match: T = { likeGroup: LikeGroup.PROPERTY, memberId: memberId };

    const data: T = await this.likeModel
    .aggregate([
      { $match: match },
      { $sort: { updatedAt: -1 } },
      {
        $lookup: {
          from: 'properties',
          localField: 'likeRefId',
          foreignField: '_id',
          as: 'favoriteProperty',
        },
      },
      { $unwind: '$favoriteProperty' },
      {
        $facet: {
          list: [
            { $skip: (page - 1) * limit }, 
            { $limit: limit }, 
            lookupFavorite, 
            { $unwind: '$favoriteProperty.memberData' }
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },
    ])
    .exec();

const result: Properties = { list: [], metaCounter: data[0].metaCounter };
result.list = data[0].list.map((ele) => ele.favoriteProperty);

    return result;
  }
}
