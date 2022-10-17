import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Item } from './model/item.model';
import { CollectionsModule } from '../collections/collections.module';

@Module({
    imports: [SequelizeModule.forFeature([Item]), CollectionsModule],
    providers: [ItemsService],
    controllers: [ItemsController],
})
export class ItemsModule {}
