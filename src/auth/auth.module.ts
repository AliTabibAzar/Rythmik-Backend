import { Module } from '@nestjs/common';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { MailModule } from 'src/shared/mail/mail.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtForgotPasswordStrategy } from './strategies/jwt-forgot-password.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RedisModule } from 'src/shared/redis/redis.module';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RedisModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtForgotPasswordStrategy,
  ],
  exports: [JwtAccessStrategy, PassportModule],
})
export class AuthModule {}
