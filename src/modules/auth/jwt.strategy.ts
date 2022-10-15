import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ACCESS_SECRET } from '../../common/constants/environment';
import { JwtUserPayload } from './interfaces/jwt-user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: ACCESS_SECRET,
        });
    }

    async validate(payload: JwtUserPayload) {
        if (payload.roles.length === 0) {
            throw new UnauthorizedException('No role. Should never happen');
        }
        return payload;
    }
}
