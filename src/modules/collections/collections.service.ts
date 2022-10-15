import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './model/collection.model';
import { CollectionsQueryBuilder, CollectionsQueryDirector } from './collections.helpers';
import { FindCollectionsQuery } from './dto/find-collections.query';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
    constructor(@InjectModel(Collection) private collectionModel: typeof Collection) {}

    findAll(query: FindCollectionsQuery) {
        const builder = new CollectionsQueryBuilder();
        const director = new CollectionsQueryDirector(builder);
        director.build(query);
        const sequelizeQuery = builder.getResult();
        return this.collectionModel.findAll({
            ...sequelizeQuery,
        });
    }

    findCollectionById(id: number) {
        return this.collectionModel.findByPk(id);
    }

    async create(createCollectionDto: CreateCollectionDto) {
        try {
            const newCollection = await this.collectionModel.create({
                ...createCollectionDto,
            });
            return newCollection;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}
