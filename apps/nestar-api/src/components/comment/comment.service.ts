import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
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
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    private readonly memberService: MemberService,
    private readonly propertyService: PropertyService,
    private readonly boardArticleService: BoardArticleService,
    private readonly notificationService: NotificationService,
  ) {}

  public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
    input.memberId = memberId;

    let result = null;
    try {
      result = await this.commentModel.create(input);
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

    let targetMemberId: string;

    if (input.commentGroup === CommentGroup.PROPERTY) {
      const property = await this.propertyService.getProperty(
        memberId,
        input.commentRefId
      );
      if (!property || !property.memberId) {
        throw new InternalServerErrorException('Property not found');
      }
      targetMemberId = property.memberId.toString();
    } else if (input.commentGroup === CommentGroup.ARTICLE) {
      const article = await this.boardArticleService.getBoardArticle(
        memberId,
        input.commentRefId
      );
      if (!article || !article.memberId) {
        throw new InternalServerErrorException('Article not found');
      }
      targetMemberId = article.memberId.toString();
    } else if (input.commentGroup === CommentGroup.MEMBER) {
      targetMemberId = input.commentRefId.toString();
    }

    if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);

    await this.notificationService.createNotification({
      notificationType: NotificationType.COMMENT,
      notificationGroup: input.commentGroup.toString() as NotificationGroup,
      notificationTitle: 'New comment',
      notificationDesc: input.commentContent?.slice(0, 100),
      receiverId: targetMemberId,
      authorId: memberId.toString(),
      articleId: input.commentGroup === CommentGroup.ARTICLE ? input.commentRefId.toString() : undefined,
      propertyId: input.commentGroup === CommentGroup.PROPERTY ? input.commentRefId.toString() : undefined,
    });

    return result;
  }

  public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
    const { _id } = input;
    const result = await this.commentModel.findOneAndUpdate(
      {
        _id,
        memberId,
        commentStatus: CommentStatus.ACTIVE,
      },
      input,
      { new: true },
    ).exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }

  public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
    const { commentRefId } = input.search;
    const match: T = { commentRefId, commentStatus: CommentStatus.ACTIVE };
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

    const result: Comments[] = await this.commentModel.aggregate([
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
    ]).exec();

    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }

  public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
    const result = await this.commentModel.findByIdAndDelete(input).exec();
    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
    return result;
  }
}
