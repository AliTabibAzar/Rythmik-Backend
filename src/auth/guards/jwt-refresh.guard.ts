import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from 'src/shared/redis/redis.service';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private redisService: RedisService) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return this.validateToken(user, context);
  }
  async validateToken(user, context) {
    const authHeader: string = context.switchToHttp().getRequest().headers[
      'authorization'
    ];
    if (!authHeader) {
      throw new UnauthorizedException();
    }
    const token = authHeader.split(' ')[1];
    const isValid = await this.redisService.get(`${user._id}:${token}`);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
