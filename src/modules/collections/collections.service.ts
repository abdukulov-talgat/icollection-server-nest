import sequelize from 'sequelize';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './model/collection.model';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Topic } from '../topics/model/topic.model';
import { EditCollectionDto } from './dto/edit-collection.dto';
import { Item } from '../items/model/item.model';
import { QueryBuilder } from '../../common/utils/query/query-builder';
import { QueryDirector } from '../../common/utils/query/query-director';
import { CollectionsQueryOptions } from '../../common/utils/query/query-options';

@Injectable()
export class CollectionsService {
    constructor(@InjectModel(Collection) private collectionModel: typeof Collection) {}

    findAll(query: CollectionsQueryOptions) {
        const builder = new QueryBuilder();
        const director = new QueryDirector(builder);
        director.buildCollectionsQuery(query);
        const sequelizeQuery = builder.getResult();
        return this.collectionModel.findAll({
            ...sequelizeQuery,
            attributes: {
                include: [
                    [sequelize.fn('COUNT', sequelize.col('items.collectionId')), 'itemsCount'],
                ],
            },
            include: [
                {
                    model: Item,
                    attributes: [],
                },
                Topic,
            ],
            group: 'id',
            subQuery: false,
        });
    }

    findCollectionById(id: number) {
        return this.collectionModel.findByPk(id, { include: [Topic] });
    }

    async create(createCollectionDto: CreateCollectionDto) {
        try {
            return await this.collectionModel.create({
                ...createCollectionDto,
            });
        } catch (e) {
            return null;
        }
    }

    async edit({ id, userId, ...body }: EditCollectionDto) {
        try {
            const collection = await this.collectionModel.findOne({
                where: {
                    id: id,
                    userId: userId,
                },
            });
            if (collection) {
                return await collection.update({ ...body });
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async remove(id: number, userId: number) {
        try {
            const count = await this.collectionModel.destroy({
                where: { id: id, userId: userId },
            });
            return count === 1;
        } catch (e) {
            return null;
        }
    }
}
