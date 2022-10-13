import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AvailableRoles, ROLE_KEY } from '../common/constants/authorization';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roleOnHandler = this.reflector.get<AvailableRoles>(ROLE_KEY, context.getHandler());
        if (!roleOnHandler) {
            return true;
        }
        const request: Request = context.switchToHttp().getRequest();
        console.log(request.user);
        return false;
    }
}
