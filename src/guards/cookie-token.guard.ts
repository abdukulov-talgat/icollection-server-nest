import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokensService } from '../modules/auth/tokens.service';
import { REFRESH_TOKEN_KEY } from '../common/constants/cookie-keys';
import { SelectUserDto } from '../modules/users/dto/select-user.dto';
import { isExpired } from '../common/utils/date-helpers';

@Injectable()
export class CookieTokenGuard implements CanActivate {
    constructor(private tokensService: TokensService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest<Request>();
            const requestToken = request.cookies[REFRESH_TOKEN_KEY];
            const dbToken = await this.tokensService.findTokenByToken(requestToken);
            if (dbToken && !isExpired(dbToken.expiredAt)) {
                request.user = new SelectUserDto(dbToken.user);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}
