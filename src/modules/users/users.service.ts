import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from '../roles/model/role.model';
import { PatchUserDto } from './dto/patch-user.dto';
import { RolesService } from '../roles/roles.service';
import { AvailableRoles } from '../../common/constants/authorization';
import { AppEvents } from '../../common/constants/app-events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Collection } from '../collections/model/collection.model';
import { Item } from '../items/model/item.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(UserRole) private userRoleModel: typeof UserRole,
        private eventEmitter: EventEmitter2,
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

    findAll() {
        return this.userModel.findAll({
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

    async deleteUserById(id: number) {
        const candidate = await this.userModel.findByPk(id, {
            include: [
                {
                    model: Collection,
                    include: [Item],
                },
            ],
        });
        if (candidate) {
            await candidate.destroy();
            this.eventEmitter.emit(AppEvents.USER_DELETE, candidate);
            return true;
        }
        return false;
    }

    countUsers() {
        return this.userModel.count();
    }
}
