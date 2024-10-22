import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserResolver } from './user/user.resolver';
import { EmailModule } from './email/email.module';
import { SettingsModule } from './settings/settings.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderGateway } from './order/order.gateway';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReviewGateway } from './reviews/review.gateway';
import { AnalyticsModule } from './analytics/analytics.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 600,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/../schema.gql'),
    }),
    UserModule,
    EmailModule,
    SettingsModule,
    ProductModule,
    OrderModule,
    NotificationsModule,
    ReviewsModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [
    UserService,
    UserResolver,
    ConfigService,
    JwtService,
    PrismaService,
    OrderGateway,
    ReviewGateway,
  ],
})
export class AppModule {}
