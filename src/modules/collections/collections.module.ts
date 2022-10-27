import { forwardRef, Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from './model/collection.model';
import { ItemsModule } from '../items/items.module';

@Module({
    imports: [SequelizeModule.forFeature([Collection]), forwardRef(() => ItemsModule)],
    providers: [CollectionsService],
    controllers: [CollectionsController],
    exports: [CollectionsService],
})
export class CollectionsModule {}
