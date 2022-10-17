import { Module } from '@nestjs/common';
import { User } from './modules/users/model/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './common/constants/environment';
import { RefreshToken } from './modules/auth/model/refresh-token.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role, UserRole } from './modules/roles/model/role.model';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { Topic } from './modules/topics/model/topic.model';
import { Collection } from './modules/collections/model/collection.model';
import { TopicsModule } from './modules/topics/topics.module';
import { AccessControlModule } from 'nest-access-control';
import { appRoles } from './common/constants/authorization';
import { ItemsModule } from './modules/items/items.module';
import { Item } from './modules/items/model/item.model';
import { Comment } from './modules/items/model/comment.model';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: DB_HOST,
            database: DB_NAME,
            username: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT,
            models: [User, Role, UserRole, RefreshToken, Collection, Topic, Item, Comment],
            autoLoadModels: true,
            synchronize: true,
            logging: false,
        }),
        ScheduleModule.forRoot(),
        TasksModule,
        AuthModule,
        AccessControlModule.forRoles(appRoles),
        TopicsModule,
        CollectionsModule,
        ItemsModule,
        EventEmitterModule.forRoot(),
    ],
})
export class AppModule {}
