import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TokensService } from '../auth/tokens.service';
import { EXPIRED_TOKENS_CLEAR_INTERVAL } from '../../common/constants/environment';

@Injectable()
export class TasksService {
    constructor(private tokensService: TokensService) {}

    @Interval(EXPIRED_TOKENS_CLEAR_INTERVAL)
    async handleTest() {
        const count = await this.tokensService.clearExpired();
        console.log(`Deleted ${count} tokens`);
    }
}
