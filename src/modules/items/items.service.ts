import { Get, Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from './model/item.model';
import { ItemsQueryOptions } from '../../common/utils/query/query-options';
import { QueryBuilder } from '../../common/utils/query/query-builder';
import { QueryDirector } from '../../common/utils/query/query-director';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';
import { Topic } from '../topics/model/topic.model';
import { CreateCollectionDto } from '../collections/dto/create-collection.dto';
import { EditCollectionDto } from '../collections/dto/edit-collection.dto';
import { Collection } from '../collections/model/collection.model';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';

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
        return this.itemModel.findByPk(id, { include: [Collection] });
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
        try {
            const count = await this.itemModel.destroy({
                where: { id: id },
            });
            return count === 1;
        } catch (e) {
            return null;
        }
    }
}
