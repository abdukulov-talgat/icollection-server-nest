import { CollectionOrderField, Direction } from '../collections.helpers';

export class FindCollectionsQuery {
    userId?: number;

    name?: string;

    page?: number;

    limit?: number;

    direction?: Direction;

    order?: CollectionOrderField;
}
