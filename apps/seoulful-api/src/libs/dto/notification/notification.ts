import { Field, ObjectType } from '@nestjs/graphql';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';
import { TotalCounter } from '../member/member';

@ObjectType()
export class AuthorData {
  @Field(() => String, { nullable: true })
  _id?: ObjectId; // 🔥 FOLLOW uchun kerak
  @Field(() => String, { nullable: true })
  memberImage?: string;

  @Field(() => String, { nullable: true })
  memberNick?: string;
}

@ObjectType()
export class Notification {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => NotificationType)
  notificationType: NotificationType;

  @Field(() => NotificationGroup)
  notificationGroup: NotificationGroup;

  @Field(() => NotificationStatus)
  notificationStatus: NotificationStatus;

  @Field(() => String)
  notificationTitle: string;

  @Field(() => String, { nullable: true })
  notificationDesc?: string;

  @Field(() => String)
  receiverId: ObjectId;

  @Field(() => String)
  authorId: ObjectId;

  @Field(() => AuthorData, { nullable: true })
  authorData?: AuthorData;

  @Field(() => String, { nullable: true })
  propertyId?: ObjectId; // ✅ LIKE, COMMENT uchun

  @Field(() => String, { nullable: true })
  articleId?: ObjectId; // ✅ LIKE, COMMENT uchun

  @Field(() => Date)
  createdAt: Date;
}



@ObjectType()
export class NotificationList {
  @Field(() => [Notification])
  list: Notification[];

  @Field(() => [TotalCounter])
  metaCounter: TotalCounter[];
}

