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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvents } from '../../common/constants/app-events';
import { ItemComment } from '../items/model/item-comment.model';

@Injectable()
export class CollectionsService {
    constructor(
        @InjectModel(Collection) private collectionModel: typeof Collection,
        private eventEmitter: EventEmitter2,
    ) {}

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
            const newCollection = await this.collectionModel.create({
                ...createCollectionDto,
            });
            const result = await this.collectionModel.findByPk(newCollection.id, {
                include: [Topic],
            });
            this.eventEmitter.emit(AppEvents.COLLECTION_CREATE_EVENT, result);
            return result;
        } catch (e) {
            console.log(e.message);
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
                include: [Topic],
            });
            if (collection) {
                const updated = await collection.update({ ...body });
                this.eventEmitter.emit(AppEvents.COLLECTION_EDIT_EVENT, updated);
                return updated;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async remove(id: number, userId: number) {
        try {
            const candidate = await this.collectionModel.findOne({
                where: { id: id, userId: userId },
                include: [
                    {
                        model: Item,
                        include: [ItemComment],
                    },
                ],
            });
            if (candidate) {
                await candidate.destroy();
                this.eventEmitter.emit(AppEvents.COLLECTION_DELETE_EVENT, candidate);
                return true;
            }
        } catch (e) {
            return null;
        }
    }
}
