import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ReviewGateway } from './review.gateway';

@Module({
  providers: [
    ReviewsResolver,
    ReviewsService,
    ReviewGateway,
    PrismaService,
    JwtService,
  ],
})
export class ReviewsModule {}
