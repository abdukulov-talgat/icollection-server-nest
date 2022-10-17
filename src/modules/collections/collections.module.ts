import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collection } from './model/collection.model';

@Module({
    imports: [SequelizeModule.forFeature([Collection])],
    providers: [CollectionsService],
    controllers: [CollectionsController],
    exports: [CollectionsService],
})
export class CollectionsModule {}
