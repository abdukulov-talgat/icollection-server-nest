import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from './model/item.model';
import { ItemsQueryOptions } from '../../common/utils/query/query-options';
import { QueryBuilder } from '../../common/utils/query/query-builder';
import { QueryDirector } from '../../common/utils/query/query-director';
import { Collection } from '../collections/model/collection.model';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import sequelize from 'sequelize';
import { ItemLike } from './model/item-like.model';

@Injectable()
export class ItemsService {
    constructor(@InjectModel(Item) private itemModel: typeof Item) {}

    findAll(query: ItemsQueryOptions) {
        const builder = new QueryBuilder();
        const director = new QueryDirector(builder);
        director.buildItemsQuery(query);
        const sequelizeQuery = builder.getResult();
        return this.itemModel.findAll({
            ...sequelizeQuery,
        });
    }

    findItemById(id: number) {
        return this.itemModel.findOne({
            where: {
                id: id,
            },
            attributes: {
                include: [[sequelize.fn('COUNT', sequelize.col('likes.itemId')), 'likesCount']],
            },
            include: [
                Collection,
                {
                    model: ItemLike,
                    attributes: [],
                },
            ],
        });
    }

    async create({ userId, ...rest }: CreateItemDto) {
        try {
            return await this.itemModel.create({
                ...rest,
            });
        } catch (e) {
            return null;
        }
    }

    async edit({ id, userId, collectionId, ...body }: EditItemDto) {
        try {
            const item = await this.itemModel.findOne({
                where: {
                    id: id,
                    collectionId: collectionId,
                },
            });
            if (item) {
                return await item.update({ ...body });
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async remove(id: number) {
        const exist = await this.itemModel.findByPk(id);
        if (exist) {
            await exist.destroy();
            return true;
        }
        return false;
    }
}
