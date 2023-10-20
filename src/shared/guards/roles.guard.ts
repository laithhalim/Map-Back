import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from 'src/common/enum/Role-Enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | never {
    const requiredRole = this.reflector.get<RoleEnum>('role', context.getHandler());
    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user: any = request.user;
    if (user.userTypeId !== requiredRole) {
      throw new UnauthorizedException('You do not have the required role.');
    }
    return true;
  }
}
