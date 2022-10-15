import { Op } from 'sequelize';
import { Topic } from '../topics/model/topic.model';
import { Includeable, Order } from 'sequelize/types/model';
import { FindCollectionsQuery } from './dto/find-collections.query';

//TODO: // Refactor this file later

export enum Direction {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type CollectionOrderField = 'name' | 'id';

export interface CollectionsQuery {
    where: {
        name?: {
            [Op.like]?: string;
        };
        userId?: {
            [Op.eq]?: number;
        };
    };
    order?: Order;
    include: Includeable | Includeable[];
    page?: number;
    limit?: number;
}

export class CollectionsQueryDirector {
    constructor(private builder: CollectionsQueryBuilder) {}

    build({ userId, name, page, limit, order, direction }: FindCollectionsQuery) {
        userId && this.builder.setUserId(userId);
        name && this.builder.setName(name);
        page && this.builder.setPage(page);
        limit && this.builder.setLimit(limit);
        direction =
            direction && Object.keys(Direction).includes(direction) ? direction : Direction.ASC;
        order && this.builder.setSort(order, direction);
    }
}

export class CollectionsQueryBuilder {
    private result: CollectionsQuery = {
        where: {},
        include: Topic,
    };

    getResult() {
        return this.result;
    }

    setName(name: string) {
        this.result.where.name = {
            [Op.like]: `%${name}%`,
        };
    }

    setUserId(userId: number) {
        this.result.where.userId = {
            [Op.eq]: userId,
        };
    }

    setSort(field: CollectionOrderField, direction: Direction) {
        this.result.order = [field, direction];
    }

    setLimit(limit: number) {
        this.result.limit = limit;
    }

    setPage(page: number) {
        this.result.page = page;
    }
}
