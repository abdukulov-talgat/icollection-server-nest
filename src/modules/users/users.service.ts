import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Role, UserRole } from '../roles/model/role.model';
import { mapPageToOffset } from '../../common/utils/helpers';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(UserRole) private userRoleModel: typeof UserRole,
    ) {}

    async create({ email, passwordHash, roleId }: CreateUserDto) {
        //sequelize doesn't support eager creating yet https://github.com/sequelize/sequelize/issues/3807
        const user = await this.userModel.create({ email, passwordHash });
        await this.userRoleModel.create({ userId: user.id, roleId: roleId });
        return this.userModel.findOne({ where: { id: user.id }, include: [Role] });
    }

    findAll(page: number, limit: number) {
        return this.userModel.findAll({
            offset: mapPageToOffset(page, limit),
            limit,
            include: [
                {
                    model: Role,
                    attributes: [],
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
                    attributes: [],
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
                    attributes: [],
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
}
