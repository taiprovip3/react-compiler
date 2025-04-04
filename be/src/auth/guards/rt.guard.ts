import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class RtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['refreshToken'];
    if (!token)
      throw new UnauthorizedException(
        '[RtGuard] No refresh token found in cookie!',
      );
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.REFRESH_SECRET,
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('[RtGuard] Invalid refresh token!');
    }
  }
}
