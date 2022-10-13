import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../roles/model/role.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    async create({ email, passwordHash, roleId }: CreateUserDto) {
        //sequelize doesn't support eager creating yet https://github.com/sequelize/sequelize/issues/3807
        const user = await this.userModel.create({ email, passwordHash, roleId });
        return this.userModel.findOne({ where: { id: user.id }, include: [Role] });
    }

    findAll(page: number, limit: number) {
        return this.userModel.findAll({
            offset: (page - 1) * limit,
            limit,
            include: [Role],
        });
    }

    findUserById(id: number) {
        return this.userModel.findByPk(id, { include: [Role] });
    }

    findUserByEmail(email: string) {
        return this.userModel.findOne({
            where: {
                email,
            },
            include: [Role],
        });
    }

    deleteUserById(id: number) {
        return this.userModel.destroy({
            where: { id },
        });
    }
}
