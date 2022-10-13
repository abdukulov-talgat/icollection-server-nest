import { RefreshToken } from './model/refresh-token.model';
import { InjectModel } from '@nestjs/sequelize';
import * as dayjs from 'dayjs';
import { User } from '../users/model/user.model';
import { REFRESH_SECRET_MAX_DAYS } from '../../common/constants/environment';

export class TokensService {
    constructor(@InjectModel(RefreshToken) private tokenModel: typeof RefreshToken) {}

    saveToken(userId: number, token: string): Promise<RefreshToken> {
        return this.tokenModel.create({
            userId,
            token: token,
            expiredAt: dayjs().add(REFRESH_SECRET_MAX_DAYS, 'days').toDate(),
        });
    }

    deleteTokenByToken(token: string): Promise<number> {
        return this.tokenModel.destroy({ where: { token } });
    }

    findTokenByToken(token: string): Promise<RefreshToken | null> {
        return this.tokenModel.findOne({
            where: { token },
            include: User,
        });
    }
}
