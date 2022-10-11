import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'icollection',
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            port: Number.parseInt(String(process.env.DB_PORT || 3306)),
        }),
        UsersModule,
    ],
})
export class AppModule {}
