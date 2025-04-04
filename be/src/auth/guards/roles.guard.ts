import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.authorities) {
      console.warn('User hoặc authorities bị undefined:', user);
      return false;
    }
    return user?.authorities.some((role) =>
      requiredRoles.includes(role.authority),
    );
  }
}
