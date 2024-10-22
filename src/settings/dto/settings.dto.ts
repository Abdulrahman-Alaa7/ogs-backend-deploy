import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { Stream } from 'stream';

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

@InputType()
export class SettingsDto {
  @Field()
  @IsNumber()
  shippingPrice?: number;

  @Field()
  @IsNumber()
  freeShippingPrice?: number;

  @Field()
  @IsString({ message: 'Free Shipping Desc En must be string' })
  @IsNotEmpty({ message: 'Free Shipping Desc En is required.' })
  freeShipDescEn: string;

  @Field()
  @IsString({ message: 'Free Shipping Desc Ar must be string' })
  @IsNotEmpty({ message: 'Free Shipping Desc Ar is required.' })
  freeShipDescAr: string;

  @Field({ nullable: true })
  @IsString({ message: 'Address must be string' })
  addressOgs?: string;

  @Field()
  @IsBoolean({ message: 'Airplane Mode Must be Boolean' })
  airPlaneMode: boolean;
}

@InputType()
export class SettingsUpdateDto {
  @Field()
  @IsString({ message: 'ID must be string' })
  @IsNotEmpty({ message: 'ID is required.' })
  id: string;

  @Field()
  @IsNumber()
  shippingPrice: number;

  @Field()
  @IsNumber()
  freeShippingPrice: number;

  @Field()
  @IsString({ message: 'Free Shipping Desc En must be string' })
  @IsNotEmpty({ message: 'Free Shipping Desc En is required.' })
  freeShipDescEn: string;

  @Field()
  @IsString({ message: 'Free Shipping Desc Ar must be string' })
  @IsNotEmpty({ message: 'Free Shipping Desc Ar is required.' })
  freeShipDescAr: string;

  @Field({ nullable: true })
  @IsString({ message: 'Address must be string' })
  addressOgs?: string;

  @Field()
  @IsBoolean({ message: 'Airplane Mode Must be Boolean' })
  airPlaneMode: boolean;
}

@InputType()
export class SettingsHeroDto {
  @Field(() => GraphQLUpload, { nullable: true })
  image?: Promise<FileUpload>;

  @Field()
  @IsString({ message: 'Title En must be string' })
  @IsNotEmpty({ message: 'Title En is required.' })
  titleEn: string;

  @Field()
  @IsString({ message: 'Title Ar must be string' })
  @IsNotEmpty({ message: 'Title Ar is required.' })
  titleAr: string;

  @Field()
  @IsString({ message: 'Desc En must be string' })
  @IsNotEmpty({ message: 'Desc En is required.' })
  descEn: string;

  @Field()
  @IsString({ message: 'Desc Ar must be string' })
  @IsNotEmpty({ message: 'Desc Ar is required.' })
  descAr: string;
}

@InputType()
export class UpdayteSettingsHeroDto {
  @Field()
  @IsString({ message: 'ID must be string' })
  @IsNotEmpty({ message: 'ID is required.' })
  id: string;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: Promise<FileUpload>;

  @Field()
  @IsString({ message: 'Title En must be string' })
  @IsNotEmpty({ message: 'Title En is required.' })
  titleEn: string;

  @Field()
  @IsString({ message: 'Title Ar must be string' })
  @IsNotEmpty({ message: 'Title Ar is required.' })
  titleAr: string;

  @Field()
  @IsString({ message: 'Desc En must be string' })
  @IsNotEmpty({ message: 'Desc En is required.' })
  descEn: string;

  @Field()
  @IsString({ message: 'Desc Ar must be string' })
  @IsNotEmpty({ message: 'Desc Ar is required.' })
  descAr: string;
}
