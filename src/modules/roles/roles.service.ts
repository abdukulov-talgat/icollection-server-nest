import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from './model/role.model';
import { InjectModel } from '@nestjs/sequelize';
import { AvailableRoles } from '../../common/constants/authorization';

@Injectable()
export class RolesService implements OnModuleInit {
    constructor(@InjectModel(Role) private roleModel: typeof Role) {}

    findRoleByValue(value: AvailableRoles) {
        return this.roleModel.findOne({ where: { value: value } });
    }

    async onModuleInit() {
        await this.ensureRolesExist();
    }

    private async ensureRolesExist() {
        await this.roleModel.bulkCreate(
            Object.values(AvailableRoles).map((r) => ({ value: r })),
            { ignoreDuplicates: true },
        );
    }
}
