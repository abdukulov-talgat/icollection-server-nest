import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from '../roles/model/role.model';
import { mapPageToOffset } from '../../common/utils/helpers';
import { PatchUserDto } from './dto/patch-user.dto';
import { RolesService } from '../roles/roles.service';
import { AvailableRoles } from '../../common/constants/authorization';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(UserRole) private userRoleModel: typeof UserRole,
        private rolesService: RolesService,
    ) {}

    async create({ email, passwordHash, roleId }: CreateUserDto) {
        const user = await this.userModel.create({ email, passwordHash });
        await this.userRoleModel.create({ userId: user.id, roleId: roleId });
        return this.userModel.findOne({ where: { id: user.id }, include: [Role] });
    }

    async edit({ id, isBanned, isAdmin }: PatchUserDto) {
        const adminRole = (await this.rolesService.findRoleByValue(AvailableRoles.ADMIN)) as Role;
        await this.userModel.update(
            { isBanned: isBanned },
            {
                where: {
                    id: id,
                },
            },
        );
        if (isAdmin) {
            await this.userRoleModel.findOrCreate({ where: { userId: id, roleId: adminRole.id } });
        } else {
            await this.userRoleModel.destroy({ where: { userId: id, roleId: adminRole.id } });
        }
        return this.findUserById(id);
    }

    findAll(page: number, limit: number) {
        return this.userModel.findAll({
            offset: mapPageToOffset(page, limit),
            limit,
            include: [
                {
                    model: Role,
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
    }

    findUserById(id: number) {
        return this.userModel.findByPk(id, {
            include: [
                {
                    model: Role,
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
    }

    findUserByEmail(email: string) {
        return this.userModel.findOne({
            where: {
                email,
            },
            include: [
                {
                    model: Role,
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
    }

    deleteUserById(id: number) {
        return this.userModel.destroy({
            where: { id },
        });
    }

    countUsers() {
        return this.userModel.count();
    }
}
