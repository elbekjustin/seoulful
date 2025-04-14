import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class Property {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => PropertyType)
  propertyType: PropertyType;

  @Field(() => PropertyStatus)
  propertyStatus: PropertyStatus;

  @Field(() => PropertyLocation)
  propertyLocation: PropertyLocation;

  @Field(() => String)
  propertyAddress: string;

  @Field(() => String)
  propertyTitle: string;

  @Field(() => [String])
  atmosphere: string[];

  @Field(() => [String])
  recommendedFor: string[];

  @Field(() => Int)
  propertyViews: number;

  @Field(() => Int)
  propertyLikes: number;

  @Field(() => Int)
  propertyComments: number;

  @Field(() => Int)
  propertyRank: number;

  @Field(() => [String])
  propertyImages: string[];

  @Field(() => String, { nullable: true })
  propertyDesc?: string;

  @Field(() => Boolean)
  hasParking: boolean;

  @Field(() => Boolean)
  open24Hours: boolean;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date, { nullable: true })
  hiddenAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date, { nullable: true })
  constructedAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  /** from aggregation **/

  @Field(() => Member, { nullable: true })
  memberData: Member;

    @Field(() => [MeLiked], { nullable: true})
  meLiked?: MeLiked[];

}

@ObjectType()
export class Properties {
  @Field(() => [Property])
  list: Property[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}

