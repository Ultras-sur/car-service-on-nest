import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'entities/user.entity';

@Injectable()
export class RolesGuardPG implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (
      !user?.roles ||
      !requireRoles.some((role) => user.roles?.includes(role))
    ) {
      throw new Error('Access denied');
    } else {
      return true;
    }
  }
}
