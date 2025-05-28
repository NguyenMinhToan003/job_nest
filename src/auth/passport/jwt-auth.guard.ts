import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_GET_TOKEN, IS_PUBLIC_KEY } from 'src/decorators/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const getToken = this.reflector.getAllAndOverride<boolean>(IS_GET_TOKEN, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (getToken) {
      return user;
    }
    if (err || !user) {
      throw err || new UnauthorizedException('access token không hợp lệ');
    }
    return user;
  }
}
