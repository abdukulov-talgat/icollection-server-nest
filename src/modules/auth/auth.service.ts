import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SelectUserDto } from '../users/dto/select-user.dto';
import { JwtService } from '@nestjs/jwt';
import { generateToken } from '../../common/utils/token-generator';
import { SignUpDto } from './dto/sign-up.dto';
import { SALT_ROUNDS } from '../../common/constants/salt-rounds';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            return new SelectUserDto(user);
        }
        return null;
    }

    async getTokens(user: SelectUserDto) {
        const refreshToken = await generateToken();
        return {
            accessToken: this.jwtService.sign({ ...user }),
            refreshToken,
        };
    }

    async createUser({ email, password }: Omit<SignUpDto, 'passwordRepeat'>) {
        const exist = await this.usersService.findUserByEmail(email);
        if (!exist) {
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            return this.usersService.create({ email, passwordHash });
        }
        return null;
    }
}
