import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    ConfigService,
    JwtService,
    PrismaService,
  ],
})
export class ProductModule {}
