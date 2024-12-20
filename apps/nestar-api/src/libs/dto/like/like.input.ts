import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
import { LikeGroup } from '../../enums/like.enum';

@InputType()
export class LikeInput {
	@IsNotEmpty()
	@Field(() => String)
	memberId: ObjectId; // kim like bosmoqda

	@IsNotEmpty()
	@Field(() => String)
	likeRefId: ObjectId; // qaysi targetni like qilmoqda

	@IsNotEmpty()
	@Field(() => LikeGroup)
	likeGroup: LikeGroup; // qaysi turdagi like member. property, article
}
