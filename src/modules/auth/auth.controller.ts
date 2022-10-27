import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { SelectUserDto } from '../users/dto/select-user.dto';
import { TokensService } from './tokens.service';
import { CookieTokenGuard } from '../../guards/cookie-token.guard';
import { REFRESH_TOKEN_KEY } from '../../common/constants/cookie-keys';
import * as dayjs from 'dayjs';
import { REFRESH_SECRET_MAX_DAYS } from '../../common/constants/environment';
import { SignUpDto, signUpDtoSchema } from './dto/sign-up.dto';
import { NopeValidationPipe } from '../../pipes/nope-validation.pipe';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService, private tokensService: TokensService) {}

    private async handleTokenRequest(dtoUser: SelectUserDto, res: Response) {
        const { accessToken, refreshToken } = await this.authService.getTokens(dtoUser);
        await this.tokensService.saveToken(dtoUser.id, refreshToken);
        res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
            httpOnly: true,
            expires: dayjs().add(REFRESH_SECRET_MAX_DAYS, 'days').toDate(),
        });
        return { accessToken };
    }

    @UseGuards(LocalAuthGuard)
    @Post('/signin')
    async signIn(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const dtoUser = req.user as SelectUserDto;
        return this.handleTokenRequest(dtoUser, res);
    }

    @Get('/refresh')
    @UseGuards(CookieTokenGuard)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const oldToken = req.cookies[REFRESH_TOKEN_KEY];
        await this.tokensService.deleteTokenByToken(oldToken);
        const dtoUser = req.user as SelectUserDto;
        return this.handleTokenRequest(dtoUser, res);
    }

    @Post('/signup')
    @UsePipes(new NopeValidationPipe(signUpDtoSchema))
    async signUp(@Body() signUpDto: SignUpDto, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.createUser({ ...signUpDto });
        if (!user) {
            throw new BadRequestException();
        }
        return this.handleTokenRequest(new SelectUserDto(user), res);
    }

    @Get('/signout')
    async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        await this.tokensService.deleteTokenByToken(req.cookies[REFRESH_TOKEN_KEY]);
        res.clearCookie(REFRESH_TOKEN_KEY);
        return { result: true, message: 'Cookie was deleted' };
    }
}
