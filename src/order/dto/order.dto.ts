import { InputType, Field } from '@nestjs/graphql';
import { Status } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class Order {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  img: string;

  @Field()
  @IsNumber()
  price: number;

  @Field()
  @IsNumber()
  quantity: number;
}

@InputType()
export class OrderDto {
  @Field()
  @IsString()
  lang: string;

  @Field()
  @IsString()
  fullName: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  phone_number: string;

  @Field({ nullable: true })
  @IsString()
  secPhone_number: string;

  @Field(() => [Order])
  order: [Order];

  @Field()
  @IsString()
  governorate: string;

  @Field({ nullable: true })
  @IsString()
  secGovernorate: string;

  @Field()
  @IsString()
  city: string;

  @Field({ nullable: true })
  @IsString()
  secCity: string;

  @Field()
  @IsString()
  address: string;

  @Field({ nullable: true })
  @IsString()
  secAddress: string;

  @Field({ nullable: true })
  @IsString()
  note: string;
}

@InputType()
export class UpdateOrderDto {
  @Field()
  @IsString()
  id: string;

  @Field()
  status: Status;
}
