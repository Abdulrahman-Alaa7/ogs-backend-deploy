import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class OrderEntity {
  @Field()
  name: string;

  @Field()
  id: string;

  @Field()
  img: string;

  @Field()
  price: number;

  @Field()
  quantity: number;
}

@ObjectType()
export class OrdersEntity {
  @Field()
  id: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  phone_number: string;

  @Field({ nullable: true })
  secPhone_number: string;

  @Field(() => [OrderEntity])
  order: OrderEntity[];

  @Field()
  governorate: string;

  @Field({ nullable: true })
  secGovernorate: string;

  @Field()
  city: string;

  @Field({ nullable: true })
  secCity: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  secAddress: string;

  @Field({ nullable: true })
  note: string;

  @Field({ nullable: true })
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class RecentOrdersEntity {
  @Field(() => [OrdersEntity])
  recentOrders: OrdersEntity[];

  @Field()
  ordersThisMonthCount: number;
}
