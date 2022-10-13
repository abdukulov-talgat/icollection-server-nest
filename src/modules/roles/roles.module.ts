import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './model/role.model';

@Module({
    imports: [SequelizeModule.forFeature([Role])],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule {}
