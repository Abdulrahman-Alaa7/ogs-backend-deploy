import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as cron from 'node-cron';

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.scheduleNotificationCleanup();
  }

  scheduleNotificationCleanup() {
    cron.schedule('0 0 0 * * *', async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      await this.prisma.notification.deleteMany({
        where: {
          createdAt: { lt: thirtyDaysAgo },
        },
      });
    });
  }

  async getNotifications() {
    const notifications = await this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications;
  }

  async updateNotifications(id: string) {
    const theNotification = await this.prisma.notification.findUnique({
      where: {
        id: id,
      },
    });

    if (!theNotification) {
      throw new BadRequestException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: {
        id: id,
      },
    });

    return { message: `Notification updated successfully` };
  }

  async updateAllNotifications() {
    await this.prisma.notification.deleteMany({});

    return { message: `Notifications Updated Successfully` };
  }
}
