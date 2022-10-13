import { Module } from '@nestjs/common';
import { User } from './modules/users/model/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './common/constants/environment';
import { RefreshToken } from './modules/auth/model/refresh-token.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: DB_HOST,
            database: DB_NAME,
            username: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
            models: [User, RefreshToken],
            autoLoadModels: true,
            synchronize: true,
            logging: false,
        }),
        AuthModule,
    ],
})
export class AppModule {}
