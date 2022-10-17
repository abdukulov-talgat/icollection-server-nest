import { mapPageToOffset } from '../helpers';
import { Direction } from './direction';
import { QueryBuilder } from './query-builder';
import { CollectionsQueryOptions, ItemsQueryOptions, QueryOptions } from './query-options';

export class QueryDirector {
    private builder: QueryBuilder;
    constructor(builder: QueryBuilder) {
        this.builder = builder;
    }

    private buildQueryBase({ name, page, limit, direction, order }: QueryOptions) {
        name && this.builder.setName(name);
        limit && this.builder.setLimit(limit);
        page && limit && this.builder.setOffset(mapPageToOffset(page, limit));
        direction =
            direction && Object.keys(Direction).includes(direction) ? direction : Direction.ASC;
        order && this.builder.setSort(order, direction);
    }

    buildCollectionsQuery({ userId, ...rest }: CollectionsQueryOptions) {
        this.buildQueryBase(rest);
        userId && this.builder.setUserId(userId);
    }

    buildItemsQuery({ collectionId, ...rest }: ItemsQueryOptions) {
        this.buildQueryBase(rest);
        collectionId && this.builder.setCollectionId(collectionId);
    }
}
