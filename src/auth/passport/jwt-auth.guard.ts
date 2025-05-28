import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_DINAMIC_KEY, IS_PUBLIC_KEY } from 'src/decorators/customize';

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
    const isDinamyc = this.reflector.getAllAndOverride<boolean>(
      IS_DINAMIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isDinamyc) {
      return user;
    }
    if (err || !user) {
      throw err || new UnauthorizedException('access token không hợp lệ');
    }
    return user;
  }
}
