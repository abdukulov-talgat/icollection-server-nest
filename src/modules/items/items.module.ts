import { forwardRef, Module } from '@nestjs/common';
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
import { TagsModule } from '../tags/tags.module';
import { Tag } from '../tags/model/tag.model';
import { ItemTag } from './model/item-tag.model';

@Module({
    imports: [
        SequelizeModule.forFeature([Item, ItemComment, ItemLike, Tag, ItemTag]),
        forwardRef(() => CollectionsModule),
        TagsModule,
    ],
    providers: [ItemsService, ItemsCommentsService, ItemsCommentsGateway, ItemsLikesService],
    controllers: [ItemsController, ItemsCommentsController, ItemsLikesController],
    exports: [ItemsService],
})
export class ItemsModule {}
