import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<User> {
    const { userID } = payload;
    const user = await this.userModel.findOne({ _id: userID });
    if (!user) {
      throw new UnauthorizedException('دسترسی کاربر مجاز نمی باشد');
    }

    return user;
  }
}
