import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResolver } from './analytics.resolver';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [AnalyticsResolver, AnalyticsService, PrismaService, JwtService],
})
export class AnalyticsModule {}
