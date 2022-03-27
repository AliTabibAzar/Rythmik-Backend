import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { MailService } from 'src/shared/mail/mail.service';
import { RedisService } from 'src/shared/redis/redis.service';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { UserTransform } from 'src/user/transforrms/user.transform';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AuthResponseInterface } from './interfaces/auth-response.interface';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';
import { JwtRequestInterface } from './interfaces/jwt-request.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private redisService: RedisService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // Sign Up
  public async signUp(
    JwtRequestInterface: JwtRequestInterface,
    signUpDto: SignUpDto,
  ): Promise<AuthResponseInterface> {
    try {
      const user = await new this.userModel(signUpDto).save();
      const payload: JwtPayloadInterface = { userID: user._id.toString() };

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);
      this.storeRefreshToken(refreshToken, user, JwtRequestInterface);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: plainToInstance(UserTransform, user.toObject()),
      };
    } catch (error) {
      if (error.code == '11000') {
        if (error.message.includes('username')) {
          throw new ConflictException(
            'نام کاربری وارد شده از قبل در دیتابیس موجود است.',
          );
        }
        if (error.message.includes('email')) {
          throw new ConflictException(
            'ایمیل وارد شده از قبل در دیتابیس موجود است.',
          );
        }
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // Sign In
  public async signIn(
    JwtRequestInterface: JwtRequestInterface,
    signInDto: SignInDto,
  ): Promise<AuthResponseInterface> {
    const { usernameOrEmail, password } = signInDto;
    const user = await this.userModel
      .findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      })
      .select('+password');

    if (user && (await compare(password, user.password))) {
      const payload: JwtPayloadInterface = { userID: user._id.toString() };

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);
      this.storeRefreshToken(refreshToken, user, JwtRequestInterface);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: plainToInstance(UserTransform, user.toObject()),
      };
    } else {
      throw new UnauthorizedException(
        'نام کاربری یا رمز عبور وارد شده غیر معتبر می باشد.',
      );
    }
  }

  // Forgot password
  public async forgotPassword(
    email: string,
  ): Promise<{ message: string; user: User }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('کاربری با ایمیل وارد شده ثبت نشده است');
    }
    const payload: JwtPayloadInterface = { userID: user._id };
    const verificationToken = await this.generateVerificationToken(payload);
    this.mailService.sendUserForgotPasswordLink(user, verificationToken);
    return {
      message: 'لینک تغییر رمز عبور برای کاربر مورد نظر با موفقیت ارسال شد.',
      user: plainToInstance(UserTransform, user.toObject()),
    };
  }

  // Change password
  public async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userModel.updateOne(
      {
        email: changePasswordDto.email,
      },
      {
        password: changePasswordDto.password,
      },
    );
    if (!user) {
      throw new NotFoundException('کاربری با ایمیل وارد شده ثبت نشده است');
    }
    return {
      message: 'رمز عبور با موفقیت تغییر یافت.',
    };
  }

  // Sign In with Google
  public async loginWithGoogle() {
    return;
  }
  // Refresh access token
  public async refreshToken(user: User): Promise<AuthResponseInterface> {
    const payload: JwtPayloadInterface = { userID: user._id.toString() };
    return {
      access_token: await this.generateAccessToken(payload),
      user: user,
    };
  }

  // Generate access token
  private async generateAccessToken(
    payload: JwtPayloadInterface,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  // Generate refresh token
  private async generateRefreshToken(
    payload: JwtPayloadInterface,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
  }

  // Generate verification token
  private async generateVerificationToken(
    payload: JwtPayloadInterface,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_FORGOT_PASSWORD_SECRET_KEY,
      expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRATION,
    });
  }

  // Save refresh token in Redis
  private async storeRefreshToken(
    token: string,
    user: User,
    JwtRequestInterface: JwtRequestInterface,
  ) {
    const today = new Date();
    JwtRequestInterface.date = today.toJSON().slice(0, 10).replace(/-/g, '/');
    JwtRequestInterface.time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    await this.redisService.set(
      `${user._id}:${token}`,
      JwtRequestInterface,
      60 * 60 * 24 * 30,
    );
  }
}
