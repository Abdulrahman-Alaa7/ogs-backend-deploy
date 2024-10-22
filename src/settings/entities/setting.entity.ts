import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Setting {
  @Field()
  id: string;

  @Field(() => Int)
  shippingPrice: number;

  @Field(() => Int)
  freeShippingPrice: number;

  @Field()
  freeShipDescEn: string;

  @Field()
  freeShipDescAr: string;

  @Field({ nullable: true })
  addressOgs?: string;

  @Field()
  airPlaneMode: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class SettingsHero {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  image?: string;

  @Field()
  titleEn: string;

  @Field()
  titleAr: string;

  @Field()
  descEn: string;

  @Field()
  descAr: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
