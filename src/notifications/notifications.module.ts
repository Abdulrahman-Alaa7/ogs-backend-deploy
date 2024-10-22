import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    NotificationsResolver,
    NotificationsService,
    PrismaService,
    JwtService,
  ],
})
export class NotificationsModule {}
