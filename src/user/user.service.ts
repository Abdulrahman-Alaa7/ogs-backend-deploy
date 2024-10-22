import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  UpdatePasswordDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../email/email.service';
import { TokenSender } from '../utils/sendToken';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async generateForgotPasswordLink(user: User) {
    const forgotPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>('FORGOT_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return forgotPasswordToken;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found with this email!');
    }
    const forgotPasswordToken = await this.generateForgotPasswordLink(user);

    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?verify=${forgotPasswordToken}`;

    await this.emailService.sendMail({
      email,
      subject: 'Reset your Password!',
      template: './forgot-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });

    return { message: `Your forgot password request succesful!` };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, activationToken } = resetPasswordDto;

    const decoded = await this.jwtService.decode(activationToken);

    if (!decoded || decoded?.exp * 1000 < Date.now()) {
      throw new BadRequestException('Invalid token!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.update({
      where: {
        id: decoded.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { user };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getLoggedInUser(req: any) {
    const user = req.user;
    const refreshToken = req.refreshtoken;
    const accessToken = req.accesstoken;
    return { user, refreshToken, accessToken };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async Logout(req: any) {
    req.user = null;
    req.refreshtoken = null;
    req.accesstoken = null;
    return { message: 'Logged out successfully!' };
  }

  async getUsers() {
    return await this.prisma.user.findMany({});
  }

  async updatePassword(req: any, updatePasswordDto: UpdatePasswordDto) {
    const { currentPassword, newPassword } = updatePasswordDto;
    const userId = req.user.id;
    if (!currentPassword || !newPassword) {
      throw new BadRequestException('Please enter old and new password!');
    }

    const userPass = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (userPass?.password === undefined) {
      throw new BadRequestException('Invalid user!');
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      userPass.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid current password!');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { user };
  }
}
