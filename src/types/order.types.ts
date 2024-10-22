import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './user.types';
import { OrdersEntity } from '../order/entities/order.entity';

@ObjectType()
export class OrderResponse {
  @Field(() => OrdersEntity)
  order: OrdersEntity | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
