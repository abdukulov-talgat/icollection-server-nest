import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './model/item.model';
import { CollectionsModule } from '../collections/collections.module';
import { Comment } from './model/comment.model';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
    imports: [SequelizeModule.forFeature([Item, Comment]), CollectionsModule],
    providers: [ItemsService, CommentsService],
    controllers: [ItemsController, CommentsController],
})
export class ItemsModule {}
