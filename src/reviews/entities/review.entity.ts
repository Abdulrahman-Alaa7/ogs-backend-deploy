import { ObjectType, Field } from '@nestjs/graphql';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
export class Review {
  @Field()
  id: string;

  @Field()
  rating: number;

  @Field()
  name: string;

  @Field()
  message: string;

  @Field(() => Product, { nullable: true })
  product: Product;

  @Field()
  productId: string;

  @Field()
  status: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
