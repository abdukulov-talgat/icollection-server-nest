import { Injectable } from '@nestjs/common';
import { Role } from './model/role.model';
import { InjectModel } from '@nestjs/sequelize';
import { AvailableRoles } from '../../common/constants/authorization';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleModel: typeof Role) {}

    findRoleByValue(value: AvailableRoles) {
        return this.roleModel.findOne({ where: { value: value } });
    }
}
