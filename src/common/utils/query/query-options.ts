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

export class ItemsQueryOptions {
    collectionId?: number;

    name?: string;

    direction?: Direction;

    order?: string;
}

export class CollectionsQueryOptions {
    userId?: number;

    name?: string;

    direction?: Direction;

    order?: string;
}
