import { ObjectType, Field } from '@nestjs/graphql';
import { Setting, SettingsHero } from '../settings/entities/setting.entity';
import { ErrorType } from './user.types';

@ObjectType()
export class SettingsResponse {
  @Field(() => Setting)
  settings: Setting | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class SettingsHeroResponse {
  @Field(() => SettingsHero)
  settingsHero: SettingsHero | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
