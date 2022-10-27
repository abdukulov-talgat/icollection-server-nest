import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './model/tag.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
import { TagsQueryOptions } from '../../common/utils/query/query-options';
import { mapPageToOffset } from '../../common/utils/helpers';

@Injectable()
export class TagsService {
    constructor(
        @InjectModel(Tag) private tagModel: typeof Tag,
        private eventEmitter: EventEmitter2,
    ) {}

    async createMany(values: string[]) {
        return this.tagModel.bulkCreate(
            values.map((v) => ({ value: v })),
            { ignoreDuplicates: true },
        );
    }

    async findAll({ page, like, limit }: TagsQueryOptions) {
        return this.tagModel.findAll({
            where: {
                value: {
                    [Op.substring]: like || '',
                },
            },
            limit: limit,
            offset: mapPageToOffset(page as number, limit as number),
        });
    }
}
