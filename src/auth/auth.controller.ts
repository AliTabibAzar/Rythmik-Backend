import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/schemas/user.schema';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { SignInDto } from './dtos/signin.dto';
import { SignUpDto } from './dtos/signup.dto';
import { AuthResponseInterface } from './interfaces/auth-response.interface';
import { Request } from 'express';
import { JwtRequestInterface } from './interfaces/jwt-request.interface';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  // AuthController Constructor
  constructor(private authService: AuthService) {}

  // Sign Up Handler
  @Post('/signup')
  signUp(
    @Req() request: Request,
    @Body() signUpDto: SignUpDto,
  ): Promise<AuthResponseInterface> {
    const JwtRequestInterfacet: JwtRequestInterface = {
      ip: request.ip,
      userAgent: request.get('user-agent'),
    };
    return this.authService.signUp(JwtRequestInterfacet, signUpDto);
  }

  // Sign In Handler
  @Post('/signin')
  @HttpCode(200)
  signIn(
    @Req() request: Request,
    @Body() signInDto: SignInDto,
  ): Promise<AuthResponseInterface> {
    const JwtRequestInterfacet: JwtRequestInterface = {
      ip: request.ip,
      userAgent: request.get('user-agent'),
    };
    return this.authService.signIn(JwtRequestInterfacet, signInDto);
  }

  // Forgot Password Handler
  @Post('/forgot-password')
  @HttpCode(200)
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string; user: User }> {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // Change Password Handler
  @Post('/change-password')
  @UseGuards(AuthGuard('jwt-forgot-password'))
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(changePasswordDto);
  }

  // Refresh Token Handler
  @Get('/refresh-token')
  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  refreshToken(@GetUser() user: User): Promise<AuthResponseInterface> {
    return this.authService.refreshToken(user);
  }
}
