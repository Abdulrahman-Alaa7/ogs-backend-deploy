import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResposne,
  ResetPasswordResponse,
  UpdatePasswordResponse,
} from '../types/user.types';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserService } from './user.service';
import { User } from '../user/entities/user.entity';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return await this.userService.Login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context: { req: Request }) {
    return await this.userService.getLoggedInUser(context.req);
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    return await this.userService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Query(() => LogoutResposne)
  @UseGuards(AuthGuard)
  async logOutUser(@Context() context: { req: Request }) {
    return await this.userService.Logout(context.req);
  }

  @Query(() => [User])
  @UseGuards(AuthGuard)
  @Roles(['Admin'])
  @UseGuards(RolesGuard)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Mutation(() => UpdatePasswordResponse)
  @UseGuards(AuthGuard)
  async updatePassword(
    @Args('updatePasswordDto') updatePasswordDto: UpdatePasswordDto,
    @Context() context: { req: Request },
  ): Promise<UpdatePasswordResponse> {
    return await this.userService.updatePassword(
      context.req,
      updatePasswordDto,
    );
  }
}
