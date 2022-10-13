import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { ACCESS_SECRET } from '../../common/constants/environment';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './model/refresh-token.model';
import { TokensService } from './tokens.service';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [
        SequelizeModule.forFeature([RefreshToken]),
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: ACCESS_SECRET,
            signOptions: {
                expiresIn: '60s',
            },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, TokensService],
    controllers: [AuthController],
})
export class AuthModule {}
