import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './model/item.model';
import { CollectionsModule } from '../collections/collections.module';
import { Comment } from './model/comment.model';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsGateway } from './comments.gateway';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './model/like.model';

@Module({
    imports: [SequelizeModule.forFeature([Item, Comment, Like]), CollectionsModule],
    providers: [ItemsService, CommentsService, CommentsGateway, LikesService],
    controllers: [ItemsController, CommentsController, LikesController],
})
export class ItemsModule {}
