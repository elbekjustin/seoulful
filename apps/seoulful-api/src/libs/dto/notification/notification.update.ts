
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { NotificationStatus } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class NotificationUpdateInput {
  @IsNotEmpty()
  @Field(() => String)
  id: ObjectId;

  @IsNotEmpty()
  @Field(() => NotificationStatus)
  status: NotificationStatus;
}
