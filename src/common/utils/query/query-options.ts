import { Direction } from './direction';

export class PaginationQueryOptions {
    limit?: number;
    page?: number;
}

export class QueryOptions extends PaginationQueryOptions {
    name?: string;

    direction?: Direction;

    order?: string;
}

export class ItemsQueryOptions extends QueryOptions {
    collectionId?: number;
}

export class CollectionsQueryOptions extends QueryOptions {
    userId?: number;
}
