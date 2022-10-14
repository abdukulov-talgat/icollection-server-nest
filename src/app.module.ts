import { Module } from '@nestjs/common';
import { User } from './modules/users/model/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './common/constants/environment';
import { RefreshToken } from './modules/auth/model/refresh-token.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './modules/roles/model/role.model';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: DB_HOST,
            database: DB_NAME,
            username: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
            models: [User, RefreshToken, Role],
            autoLoadModels: true,
            synchronize: true,
            logging: false,
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        TasksModule,
    ],
})
export class AppModule {}
