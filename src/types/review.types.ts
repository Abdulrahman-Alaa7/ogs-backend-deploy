import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './user.types';
import { Review } from '../reviews/entities/review.entity';

@ObjectType()
export class ReviewResponse {
  @Field(() => Review)
  review: Review | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
