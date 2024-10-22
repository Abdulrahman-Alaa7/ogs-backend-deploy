import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { MessageResponse } from '../types/user.types';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [Notification])
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getNotifications() {
    return await this.notificationsService.getNotifications();
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async updateNotification(
    @Args('id')
    id: string,
  ): Promise<MessageResponse> {
    return await this.notificationsService.updateNotifications(id);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async updateAllNotification(): Promise<MessageResponse> {
    return await this.notificationsService.updateAllNotifications();
  }
}
