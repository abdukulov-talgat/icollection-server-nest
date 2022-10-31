import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Item } from './model/item.model';
import { ItemsQueryOptions } from '../../common/utils/query/query-options';
import { QueryBuilder } from '../../common/utils/query/query-builder';
import { QueryDirector } from '../../common/utils/query/query-director';
import { Collection } from '../collections/model/collection.model';
import { CreateItemDto } from './dto/create-item.dto';
import { EditItemDto } from './dto/edit-item.dto';
import sequelize, { Op } from 'sequelize';
import { ItemLike } from './model/item-like.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvents } from '../../common/constants/app-events';
import { ItemTag } from './model/item-tag.model';
import { TagsService } from '../tags/tags.service';
import { Tag } from '../tags/model/tag.model';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/model/user.model';
import { Topic } from '../topics/model/topic.model';

@Injectable()
export class ItemsService {
    constructor(
        private sequelize: Sequelize,
        @InjectModel(Item) private itemModel: typeof Item,
        @InjectModel(Tag) private tagModel: typeof Tag,
        @InjectModel(ItemTag) private itemTagModel: typeof ItemTag,
        @InjectModel(ItemLike) private itemLikeModel: typeof ItemLike,
        private tagsService: TagsService,
        private eventEmitter: EventEmitter2,
    ) {}

    private async bindItemWithTags(item: Item, tags: string[]) {
        if (tags.length === 0) {
            return;
        }
        await this.tagModel.bulkCreate(
            tags.map((v) => ({ value: v })),
            { ignoreDuplicates: true },
        );
        const createdTags = await this.tagModel.findAll({
            where: {
                value: {
                    [Op.or]: tags,
                },
            },
        });
        await this.itemTagModel.bulkCreate(
            createdTags.map((t) => ({ tagId: t.id, itemId: item.id })),
        );
    }

    private async unbindItemWithTags(item: Item) {
        return await this.itemTagModel.destroy({
            where: {
                itemId: item.id,
            },
        });
    }

    findAll(query: ItemsQueryOptions) {
        const builder = new QueryBuilder();
        const director = new QueryDirector(builder);
        director.buildItemsQuery(query);
        const sequelizeQuery = builder.getResult();
        return this.itemModel.findAll({
            ...sequelizeQuery,
            attributes: {
                include: [
                    [sequelize.col('collection.name'), 'collectionName'],
                    [sequelize.col('collection.user.email'), 'userEmail'],
                ],
            },
            include: [
                {
                    model: Collection,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: User,
                            required: true,
                            attributes: ['id', 'email', 'isBanned'],
                        },
                    ],
                },
                {
                    model: Tag,
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
    }

    findItemById(id: number) {
        return this.itemModel.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: Collection,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'email'],
                        },
                        Topic,
                    ],
                },
                {
                    model: ItemLike,
                    attributes: [],
                },
                {
                    model: Tag,
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
    }

    findManyByIds(ids: number[]) {
        return this.itemModel.findAll({
            where: {
                [Op.or]: {
                    id: ids,
                },
            },
            include: [
                {
                    model: Collection,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'email'],
                        },
                        Topic,
                    ],
                },
                {
                    model: ItemLike,
                    attributes: [],
                },
                {
                    model: Tag,
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
    }

    async create({ userId, tags, ...rest }: CreateItemDto) {
        try {
            const item = await this.itemModel.create({
                ...rest,
            });
            await this.bindItemWithTags(item, tags);
            const newItem = await this.itemModel.findByPk(item.id, {
                include: [
                    {
                        model: Tag,
                        through: {
                            attributes: [],
                        },
                    },
                ],
            });
            this.eventEmitter.emit(AppEvents.ITEM_CREATE_EVENT, newItem);
            return newItem;
        } catch (e) {
            return null;
        }
    }

    async edit({ id, userId, collectionId, tags, ...body }: EditItemDto) {
        try {
            const exist = await this.itemModel.findOne({
                where: {
                    id: id,
                    collectionId: collectionId,
                },
            });
            if (!exist) {
                return null;
            }

            await exist.update({ ...body });
            await this.unbindItemWithTags(exist);
            await this.bindItemWithTags(exist, tags);
            console.log('EXISTS');

            const updatedItem = await this.itemModel.findByPk(exist.id, {
                include: [
                    {
                        model: Tag,
                        through: {
                            attributes: [],
                        },
                    },
                ],
            });
            this.eventEmitter.emit(AppEvents.ITEM_EDIT_EVENT, updatedItem);
            return updatedItem;
        } catch (e) {
            return null;
        }
    }

    async remove(id: number) {
        try {
            await this.itemModel.destroy({
                where: {
                    id: id,
                },
            });
            this.eventEmitter.emit(AppEvents.ITEM_DELETE_EVENT, id);
            return true;
        } catch (e) {
            return false;
        }
    }

    async removeAllItemsForCollection(collectionId: number) {
        try {
            const deletedIds = await this.itemModel.findAll({
                where: { collectionId: collectionId },
                attributes: ['id'],
            });
            await this.itemModel.destroy({
                where: {
                    collectionId: collectionId,
                },
            });
            this.eventEmitter.emit(
                AppEvents.ITEM_DELETE_MANY_ITEMS_EVENT,
                deletedIds.map((i) => i.id),
            );
            return true;
        } catch (e) {
            return false;
        }
    }

    async getLikesInfo(itemId: number, userId?: any) {
        const likes = await this.itemLikeModel.findAll({ where: { itemId: itemId } });
        return [likes.length, likes.filter((like) => like.userId === userId).length !== 0];
    }
}
