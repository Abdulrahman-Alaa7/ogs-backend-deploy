import { ObjectType, Field } from '@nestjs/graphql';
import { Review } from '../../reviews/entities/review.entity';

@ObjectType()
export class Product {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  mainImage: string;

  @Field(() => [String], { nullable: true })
  images: string[];

  @Field({ nullable: true })
  descriptionEn: string;

  @Field({ nullable: true })
  descriptionAr: string;

  @Field(() => [Review], { nullable: true })
  reviews: Review[];

  @Field()
  price: number;

  @Field({ nullable: true })
  estimatedPrice: number;

  @Field()
  offer: boolean;

  @Field()
  aiGen: boolean;

  @Field()
  soldOut: boolean;

  @Field()
  publicPro: boolean;

  @Field()
  purchased: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ProductWithSug {
  @Field(() => Product, { nullable: true })
  product: Product;

  @Field(() => [Product], { nullable: true })
  randomProducts: Product[];
}
