import { InputType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from '../../settings/dto/settings.dto';

@InputType()
export class ProductDto {
  @Field()
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @Field(() => GraphQLUpload, { nullable: true })
  mainImage?: FileUpload;

  @Field(() => [GraphQLUpload], { nullable: true })
  @IsArray()
  images: FileUpload[];

  @Field({ nullable: true })
  descriptionEn: string;

  @Field({ nullable: true })
  descriptionAr: string;

  @Field()
  @IsNumber()
  price: number;

  @Field({ nullable: true })
  @IsNumber()
  estimatedPrice: number;

  @Field()
  @IsBoolean({ message: 'offer Mode Must be Boolean' })
  offer: boolean;

  @Field()
  @IsBoolean({ message: 'AiGen Mode Must be Boolean' })
  aiGen: boolean;

  @Field()
  @IsBoolean({ message: 'sold out Mode Must be Boolean' })
  soldOut: boolean;

  @Field()
  @IsBoolean({ message: 'public Mode Must be Boolean' })
  publicPro: boolean;
}

@InputType()
export class UpdateProductDto {
  @Field()
  @IsString({ message: 'ID must be string' })
  @IsNotEmpty({ message: 'ID is required.' })
  id: string;

  @Field()
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @Field(() => GraphQLUpload, { nullable: true })
  mainImage?: FileUpload;

  @Field(() => [GraphQLUpload], { nullable: true })
  @IsArray()
  images: FileUpload[];

  @Field({ nullable: true })
  descriptionEn: string;

  @Field({ nullable: true })
  descriptionAr: string;

  @Field()
  @IsNumber()
  price: number;

  @Field({ nullable: true })
  @IsNumber()
  estimatedPrice: number;

  @Field()
  @IsBoolean({ message: 'offer Mode Must be Boolean' })
  offer: boolean;

  @Field()
  @IsBoolean({ message: 'AiGen Mode Must be Boolean' })
  aiGen: boolean;

  @Field()
  @IsBoolean({ message: 'sold out Mode Must be Boolean' })
  soldOut: boolean;

  @Field()
  @IsBoolean({ message: 'public Mode Must be Boolean' })
  publicPro: boolean;
}
