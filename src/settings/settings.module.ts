import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsResolver } from './settings.resolver';
import { UserResolver } from '../user/user.resolver';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [
    SettingsResolver,
    SettingsService,
    UserResolver,
    UserService,
    ConfigService,
    JwtService,
    PrismaService,
  ],
})
export class SettingsModule {}
