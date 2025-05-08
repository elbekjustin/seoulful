import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { NotificationGroup, NotificationType } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';
import { AuthorData } from './notification';

@InputType()
export class NotificationInput {
  @IsNotEmpty()
  @Field(() => NotificationType)
  notificationType: NotificationType;

  @IsNotEmpty()
@Field(() => NotificationGroup)
notificationGroup: NotificationGroup;


  @IsNotEmpty()
  @Field(() => String)
  notificationTitle: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  notificationDesc?: string;

  @IsNotEmpty()
  @Field(() => String)
  receiverId: string;

  @IsNotEmpty()
  @Field(() => String)
  authorId: string;

  @Field(() => AuthorData, { nullable: true })
  authorData?: AuthorData;

  @IsOptional()
  @Field(() => String, { nullable: true })
  articleId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  propertyId?: string;
}


@InputType()
export class NotificationInquiry {
  @Field(() => Int)
  @Min(1)
  page: number;

  @Field(() => Int)
  @Min(1)
  limit: number;
}
