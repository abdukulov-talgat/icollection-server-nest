import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { OnEvent } from '@nestjs/event-emitter';
import { AppEvents } from '../../common/constants/app-events';
import { CollectionSearchDto } from './dto/collection-search.dto';
import { Collection } from '../collections/model/collection.model';
import { ElasticIndices, SEARCH_FUZZINESS } from '../../common/constants/search';
import { Item } from '../items/model/item.model';
import { ItemSearchDto } from './dto/item-search.dto';
import { ItemCommentSearchDto } from './dto/item-comment-search.dto';
import { ItemComment } from '../items/model/item-comment.model';
import { User } from '../users/model/user.model';
import { ItemsService } from '../items/items.service';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService implements OnModuleInit {
    constructor(
        private elasticsearchService: ElasticsearchService,
        private itemsService: ItemsService,
    ) {}

    private async dropIndices() {
        await this.elasticsearchService.indices.delete({
            index: [
                ElasticIndices.ITEMS,
                ElasticIndices.ITEMS_COMMENTS,
                ElasticIndices.COLLECTIONS,
            ],
        });
    }

    async onModuleInit() {
        // await this.dropIndices();
        await this.ensureIndicesExist();
    }

    private async ensureIndicesExist() {
        await Promise.all([
            this.ensureCollectionsIndexExist(),
            this.ensureItemsIndexExist(),
            this.ensureItemsCommentsExist(),
        ]);
    }

    private async ensureCollectionsIndexExist() {
        const exist = await this.elasticsearchService.indices.exists({
            index: ElasticIndices.COLLECTIONS,
        });
        if (!exist) {
            await this.elasticsearchService.indices.create({
                index: ElasticIndices.COLLECTIONS,
                mappings: {
                    properties: {
                        id: {
                            type: 'long',
                            index: false,
                        },
                        name: {
                            type: 'text',
                        },
                        description: {
                            type: 'text',
                        },
                        topic: {
                            type: 'text',
                        },
                    },
                },
            });
        }
    }

    private async ensureItemsIndexExist() {
        const exist = await this.elasticsearchService.indices.exists({
            index: ElasticIndices.ITEMS,
        });
        if (!exist) {
            await this.elasticsearchService.indices.create({
                index: ElasticIndices.ITEMS,
                mappings: {
                    properties: {
                        id: {
                            type: 'long',
                            index: false,
                        },
                        collectionId: {
                            type: 'long',
                            index: false,
                        },
                        name: {
                            type: 'text',
                        },
                        customColumns: {
                            type: 'text',
                        },
                        tags: {
                            type: 'keyword',
                        },
                    },
                },
            });
        }
    }

    private async ensureItemsCommentsExist() {
        const exist = await this.elasticsearchService.indices.exists({
            index: ElasticIndices.ITEMS_COMMENTS,
        });
        if (!exist) {
            await this.elasticsearchService.indices.create({
                index: ElasticIndices.ITEMS_COMMENTS,
                mappings: {
                    properties: {
                        id: {
                            type: 'long',
                            index: false,
                        },
                        text: {
                            type: 'text',
                        },
                        itemId: {
                            type: 'long',
                            index: false,
                        },
                        userId: {
                            type: 'long',
                            index: false,
                        },
                    },
                },
            });
        }
    }

    private async deleteCommentsByItemIds(itemIds: number[]) {
        await this.elasticsearchService.deleteByQuery({
            index: ElasticIndices.ITEMS_COMMENTS,
            query: {
                terms: {
                    itemId: itemIds,
                },
            },
        });
    }

    private async deleteItemsByCollectionIds(collectionIds: number[]) {
        await this.elasticsearchService.deleteByQuery({
            index: ElasticIndices.ITEMS,
            query: {
                terms: {
                    collectionId: collectionIds,
                },
            },
        });
    }

    private async deleteCollectionsByUserId(userId: number) {
        await this.elasticsearchService.deleteByQuery({
            index: ElasticIndices.COLLECTIONS,
            query: {
                terms: {
                    userId: [userId],
                },
            },
        });
    }

    private async deleteCommentsByUserId(userId: number) {
        await this.elasticsearchService.deleteByQuery({
            index: ElasticIndices.ITEMS_COMMENTS,
            query: {
                terms: {
                    userId: [userId],
                },
            },
        });
    }

    @OnEvent(AppEvents.USER_DELETE)
    async handleUserDelete(user: User) {
        await this.deleteCollectionsByUserId(user.id);
        await this.deleteItemsByCollectionIds(user.collections.map((c) => c.id));
        await this.deleteCommentsByUserId(user.id);
        await this.deleteCommentsByItemIds(
            user.collections.flatMap((col) => col.items.map((it) => it.id)),
        );
    }

    @OnEvent(AppEvents.COLLECTION_CREATE_EVENT)
    async handleCollectionCreate(collection: Collection) {
        const dto = new CollectionSearchDto(collection);
        await this.elasticsearchService.index({
            index: ElasticIndices.COLLECTIONS,
            id: dto.id.toString(),
            document: dto,
        });
    }

    @OnEvent(AppEvents.COLLECTION_EDIT_EVENT)
    async handleCollectionEdit(collection: Collection) {
        await this.handleCollectionCreate(collection);
    }

    @OnEvent(AppEvents.COLLECTION_DELETE_EVENT)
    async handleCollectionDelete(collection: Collection) {
        const itemIds = collection.items.map((it) => it.id);
        const collectionIds = [collection.id];
        await this.elasticsearchService.delete({
            index: ElasticIndices.COLLECTIONS,
            id: collection.id.toString(),
        });
        await this.deleteCommentsByItemIds(itemIds);
        await this.deleteItemsByCollectionIds(collectionIds);
    }

    @OnEvent(AppEvents.ITEM_CREATE_EVENT)
    async handleItemCreate(item: Item) {
        const dto = new ItemSearchDto(item);
        await this.elasticsearchService.index({
            index: ElasticIndices.ITEMS,
            id: dto.id.toString(),
            document: dto,
        });
    }

    @OnEvent(AppEvents.ITEM_EDIT_EVENT)
    async handleItemEdit(item: Item) {
        await this.handleItemCreate(item);
    }

    @OnEvent(AppEvents.ITEM_DELETE_EVENT)
    async handleItemDelete(id: number) {
        await this.elasticsearchService.delete({
            index: ElasticIndices.ITEMS,
            id: id.toString(),
        });
        await this.deleteCommentsByItemIds([id]);
    }

    @OnEvent(AppEvents.ITEM_COMMENT_CREATE_EVENT)
    async handleCommentCreate(comment: ItemComment) {
        const dto = new ItemCommentSearchDto(comment);
        await this.elasticsearchService.index({
            index: ElasticIndices.ITEMS_COMMENTS,
            id: dto.id.toString(),
            document: dto,
        });
    }

    async search(query: string) {
        const result = await this.elasticsearchService.search({
            index: Object.values(ElasticIndices).join(),
            query: {
                simple_query_string: {
                    query: `${query}~${SEARCH_FUZZINESS}`,
                },
            },
        });
        return this.resolveSearchIndices(result.hits.hits);
    }

    async tags(query: string) {
        const result = await this.elasticsearchService.search({
            index: ElasticIndices.ITEMS,
            query: {
                term: {
                    tags: query || '',
                },
            },
        });
        const itemIds = result.hits.hits.map((hit) => (hit._source as any).id);
        return this.itemsService.findManyByIds(itemIds);
    }

    private resolveSearchIndices(hits: SearchHit<any>[]) {
        // const collectionIds = []; //TODO: Finish this later
        const itemIds: number[] = [];
        hits.forEach((hit) => {
            if (hit._index === ElasticIndices.ITEMS) itemIds.push(hit._source.id);
            else if (hit._index === ElasticIndices.ITEMS_COMMENTS) itemIds.push(hit._source.itemId);
        });
        return this.itemsService.findManyByIds(itemIds);
    }
}
