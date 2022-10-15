import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './model/user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRole } from '../roles/model/role.model';

@Module({
    imports: [SequelizeModule.forFeature([User, UserRole])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
