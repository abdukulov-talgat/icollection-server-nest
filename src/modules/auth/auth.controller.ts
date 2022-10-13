import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
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
import { SignUpDto } from './dto/sign-up.dto';
import { validateSignUp } from '../../common/utils/validators';
import { RoleGuard } from '../../guards/role.guard';
import { AvailableRoles } from '../../common/constants/authorization';
import { Roles } from '../../decorators/roles.decorator';

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
    async signUp(@Body() signUpDto: SignUpDto, @Res({ passthrough: true }) res: Response) {
        if (!validateSignUp(signUpDto)) {
            throw new BadRequestException();
        }
        const user = await this.authService.createUser({ ...signUpDto });
        if (!user) {
            throw new BadRequestException();
        }
        return this.handleTokenRequest(new SelectUserDto(user), res);
    }

    @Get('/')
    @UseGuards(AccessJwtGuard)
    async foo() {
        return 'JWT Guard';
    }

    @Get('/admin')
    @Roles(AvailableRoles.ADMIN)
    @UseGuards(AccessJwtGuard, RoleGuard)
    async bar() {
        return 'Admin only page';
    }
}
