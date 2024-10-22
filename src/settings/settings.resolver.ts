import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SettingsService } from './settings.service';
import { Setting, SettingsHero } from './entities/setting.entity';
import {
  SettingsHeroResponse,
  SettingsResponse,
} from 'src/types/settings.types';
import {
  SettingsDto,
  SettingsHeroDto,
  SettingsUpdateDto,
  UpdayteSettingsHeroDto,
} from './dto/settings.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { MessageResponse } from '../types/user.types';

@Resolver(() => Setting)
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Mutation(() => SettingsResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async creatSettings(
    @Args('settingsDto') settingsDto: SettingsDto,
  ): Promise<SettingsResponse> {
    return await this.settingsService.createSettings(settingsDto);
  }

  @Mutation(() => SettingsResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async updateSettings(
    @Args('settingsUpdateDto') settingsUpdateDto: SettingsUpdateDto,
  ): Promise<SettingsResponse> {
    return await this.settingsService.updateSettings(settingsUpdateDto);
  }

  @Query(() => [Setting])
  async getSettings() {
    return await this.settingsService.getSettings();
  }

  @Mutation(() => SettingsHeroResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async createSettingsHero(
    @Args('settingsHeroDto') settingsHeroDto: SettingsHeroDto,
  ): Promise<SettingsHeroResponse> {
    return await this.settingsService.createSettingsHero(settingsHeroDto);
  }

  @Query(() => [SettingsHero])
  async getSettingsHero() {
    return await this.settingsService.getSettingsHero();
  }

  @Mutation(() => SettingsHeroResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async updateSettingsHero(
    @Args('updateSettingsHeroDto')
    updateSettingsHeroDto: UpdayteSettingsHeroDto,
  ): Promise<SettingsHeroResponse> {
    return await this.settingsService.updateSettingsHero(updateSettingsHeroDto);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async deleteHero(
    @Args('id')
    id: string,
  ): Promise<MessageResponse> {
    return await this.settingsService.deleteHero(id);
  }
}
