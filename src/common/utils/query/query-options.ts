import { Direction } from './direction';

export class QueryOptions {
    name?: string;

    page?: number;

    limit?: number;

    direction?: Direction;

    order?: string;
}

export class ItemsQueryOptions extends QueryOptions {
    collectionId?: number;
}

export class CollectionsQueryOptions extends QueryOptions {
    userId?: number;
}
