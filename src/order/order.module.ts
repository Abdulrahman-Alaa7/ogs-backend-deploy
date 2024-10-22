import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderGateway } from './order.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    PrismaService,
    OrderGateway,
    JwtService,
  ],
})
export class OrderModule {}
