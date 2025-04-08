import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Dùng jwt strategy để bảo vệ router
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('[JwtAuthGuard] Token đã hết hạn!');
      }

      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('[JwtAuthGuard] Token không hợp lệ!');
      }

      // fallback
      throw new UnauthorizedException(
        '[JwtAuthGuard] Không tìm thấy đính kèm token. Xác thực thất bại!',
      );
    }
    return user;
  }
}
