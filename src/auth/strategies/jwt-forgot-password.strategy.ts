import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtForgotPasswordStrategy extends PassportStrategy(
  Strategy,
  'jwt-forgot-password',
) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_FORGOT_PASSWORD_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  validate(payload: JwtPayloadInterface): JwtPayloadInterface {
    return payload;
  }
}
