import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class PropertyUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => PropertyType, { nullable: true })
  propertyType?: PropertyType;

  @IsOptional()
  @Field(() => PropertyStatus, { nullable: true })
  propertyStatus?: PropertyStatus;

  @IsOptional()
  @Field(() => PropertyLocation, { nullable: true })
  propertyLocation?: PropertyLocation;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  propertyAddress?: string;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  propertyTitle?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  atmosphere?: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  recommendedFor?: string[];

  @IsOptional()
  @Field(() => [String], { nullable: true })
  propertyImages?: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  propertyDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  hasParking?: boolean;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  open24Hours?: boolean;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  constructedAt?: Date;

  // optional fields without decorators, for internal use
  hiddenAt?: Date;
  deletedAt?: Date;
}
