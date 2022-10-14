import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SelectUserDto } from '../users/dto/select-user.dto';
import { JwtService } from '@nestjs/jwt';
import { generateToken } from '../../common/utils/token-generator';
import { SignUpDto } from './dto/sign-up.dto';
import { SALT_ROUNDS } from '../../common/constants/salt-rounds';
import { RolesService } from '../roles/roles.service';
import { AvailableRoles } from '../../common/constants/authorization';
import { Role } from '../roles/model/role.model';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private rolesService: RolesService,
    ) {}

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
            const { id: roleId } = (await this.rolesService.findRoleByValue(
                // sequelize cant "create and connect" like prisma. Should I Use find or just number?
                AvailableRoles.USER,
            )) as Role;
            const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
            return await this.usersService.create({ email, passwordHash, roleId });
        }
        return null;
    }
}
