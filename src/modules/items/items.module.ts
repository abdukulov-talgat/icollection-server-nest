import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './model/item.model';
import { CollectionsModule } from '../collections/collections.module';
import { ItemComment } from './model/item-comment.model';
import { ItemsCommentsController } from './items-comments.controller';
import { ItemsCommentsService } from './items-comments.service';
import { ItemsCommentsGateway } from './items-comments.gateway';
import { ItemsLikesService } from './items-likes.service';
import { ItemsLikesController } from './items-likes.controller';
import { ItemLike } from './model/item-like.model';

@Module({
    imports: [SequelizeModule.forFeature([Item, ItemComment, ItemLike]), CollectionsModule],
    providers: [ItemsService, ItemsCommentsService, ItemsCommentsGateway, ItemsLikesService],
    controllers: [ItemsController, ItemsCommentsController, ItemsLikesController],
})
export class ItemsModule {}
