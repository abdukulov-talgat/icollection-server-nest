import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AvailableRoles, ROLE_KEY } from '../common/constants/authorization';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { isSelectUserDto } from '../common/utils/predicates';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roleOnHandler = this.reflector.get<AvailableRoles>(ROLE_KEY, context.getHandler());
        if (!roleOnHandler) {
            return true;
        }
        const user = (context.switchToHttp().getRequest() as Request).user;
        return isSelectUserDto(user) && user.role === roleOnHandler;
    }
}
