import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { PropertyService } from '../property/property.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Comments, Comment } from '../../libs/dto/comment/comment'; 
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { lookupMember } from '../../libs/config';
import { T } from '../../libs/types/common';

export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private readonly memberService: MemberService,
    private readonly propertyService: PropertyService,
    private readonly boardArticleService: BoardArticleService,
  ) {}

  public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
    input.memberId = memberId; // Foydalanuvchi ID sini input obyektiga qo'shadi

    let result = null;
    try {
      result = await this.commentModel.create(input); // Ma'lumotni DB'ga saqlaydi
    } catch (err) {
      console.log('Error, Service.model:', err.message);
      throw new BadRequestException(Message.CREATE_FAILED);
    }

    switch (input.commentGroup) {
      case CommentGroup.PROPERTY:
        await this.propertyService.propertyStatsEditor({
          _id: input.commentRefId,
          targetKey: 'propertyComments',
          modifier: 1,
        });
        break;

      case CommentGroup.ARTICLE:
        await this.boardArticleService.boardArticleStatsEditor({
          _id: input.commentRefId,
          targetKey: 'articleComments',
          modifier: 1,
        });
        break;

      case CommentGroup.MEMBER:
        await this.memberService.memberStatsEditor({
          _id: input.commentRefId,
          targetKey: 'memberComments',
          modifier: 1,
        });
        break;
    }

    if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
    console.log("input=2=", input ); // nega ishlamadi ?

    return result;
  }


  public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
    console.log("input=3=", input ); //done
    
  const { _id } = input;
  const result = await this.commentModel.findOneAndUpdate(
    {
      _id: _id,                   // Yangilanishi kerak bo'lgan commentning ID si.
      memberId: memberId,         // Comment faqat o'sha foydalanuvchiga tegishli bo'lishi kerak.
      commentStatus: CommentStatus.ACTIVE, // Faqat ACTIVE statusdagi comment yangilanadi.
    },
    input,                       // Yangilanish uchun yangi ma'lumotlar.
    { new: true },               // Yangilangan hujjatni qaytaradi.
  );

  if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
  return result;
}


public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
  const { commentRefId } = input.search;
  const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
  const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

  const result: Comments[] = await this.commentModel.aggregate([
    { $match: match },
    { $sort: sort },
    {
      $facet: {
        list: [
          { $skip: (input.page - 1) * input.limit },
          { $limit: input.limit },
          // meLiked
          lookupMember,
          { $unwind: '$memberData' },
        ],
        metaCounter: [{ $count: 'total' }],
      },
    },
  ]);

  if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
  return result[0];
}

    /** ADMIN **/

public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
  const result = await this.commentModel.findByIdAndDelete(input);
  if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
  return result;
}



}
