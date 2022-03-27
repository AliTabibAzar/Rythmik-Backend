import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/google/redirect',
      scope: ['email', 'profile'],
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: 'Issuer',
      algorithms: ['RS256'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    console.log(user);

    done(null, user);
  }
}
