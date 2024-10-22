import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { SettingsResolver } from '../settings/settings.resolver';
import { SettingsService } from '../settings/settings.service';

@Module({
  providers: [
    UserResolver,
    UserService,
    SettingsResolver,
    SettingsService,
    ConfigService,
    JwtService,
    PrismaService,
  ],
})
export class UserModule {}
