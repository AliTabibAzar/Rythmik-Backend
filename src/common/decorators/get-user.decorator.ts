import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/user/schemas/user.schema';
import { UserTransform } from 'src/user/transforrms/user.transform';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return plainToInstance(UserTransform, request.user.toObject());
  },
);
