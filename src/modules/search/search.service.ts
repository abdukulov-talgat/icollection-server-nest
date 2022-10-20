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

@Injectable()
export class SearchService implements OnModuleInit {
    constructor(private elasticsearchService: ElasticsearchService) {}

    async onModuleInit() {
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
                    },
                },
            });
        }
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
        return result.hits.hits.map((hit) => ({ index: hit._index, data: hit._source }));
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
    async handleCollectionDelete(id: number) {
        await this.elasticsearchService.delete({
            index: ElasticIndices.COLLECTIONS,
            id: id.toString(),
        });
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
}
