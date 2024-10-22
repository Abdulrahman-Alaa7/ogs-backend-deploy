import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './user.types';
import { Product } from '../product/entities/product.entity';

@ObjectType()
export class ProductResponse {
  @Field(() => Product)
  product: Product | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
