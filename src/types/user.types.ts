import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../user/entities/user.entity';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  activation_token: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ActivationResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User | unknown;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LogoutResposne {
  @Field()
  message?: string;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ResetPasswordResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class UpdateProfileUserResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class UpdatePasswordResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class UpdateUserProfilePicResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class GetUserByIdResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class UserResponse {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class MessageResponse {
  @Field()
  message: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
