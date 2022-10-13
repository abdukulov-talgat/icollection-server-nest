import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './model/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) {}

    create({ email, passwordHash }: CreateUserDto) {
        return this.userModel.create({
            email,
            passwordHash,
            isBanned: false,
        });
    }

    findAll(page: number, limit: number) {
        return this.userModel.findAll({
            offset: (page - 1) * limit,
            limit,
        });
    }

    findUserById(id: number) {
        return this.userModel.findByPk(id);
    }

    findUserByEmail(email: string) {
        return this.userModel.findOne({
            where: {
                email,
            },
        });
    }

    deleteUserById(id: number) {
        return this.userModel.destroy({
            where: { id },
        });
    }
}
