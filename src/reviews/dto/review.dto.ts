import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateReviewDto {
  @Field()
  @IsNumber()
  rating: number;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  message: string;

  @Field()
  @IsString()
  productId: string;
}

@InputType()
export class UpdateReviewDto {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsBoolean()
  status: boolean;
}
