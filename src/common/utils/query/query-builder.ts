import { Op } from 'sequelize';
import { Direction } from './direction';
import { QueryResult } from './query-result';

export class QueryBuilder {
    private result: QueryResult = {
        where: {},
    };

    getResult() {
        return this.result;
    }

    reset() {
        this.result = { where: {} };
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

    setCollectionId(collectionId: number) {
        this.result.where.collectionId = {
            [Op.eq]: collectionId,
        };
    }

    setSort(field: string, direction: Direction) {
        this.result.order = [[field, direction]];
    }

    setLimit(limit: number) {
        this.result.limit = limit;
    }

    setOffset(offset: number) {
        this.result.offset = offset;
    }
}
