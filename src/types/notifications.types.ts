import { ObjectType, Field } from '@nestjs/graphql';
import { ErrorType } from './user.types';
import { Notification } from '../notifications/entities/notification.entity';

@ObjectType()
export class NotificationsResponse {
  @Field(() => Notification)
  notifications: Notification | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
