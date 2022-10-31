import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from './model/tag.model';
import { Op } from 'sequelize';

@Injectable()
export class TagsService {
    constructor(@InjectModel(Tag) private tagModel: typeof Tag) {}

    async createMany(values: string[]) {
        return this.tagModel.bulkCreate(
            values.map((v) => ({ value: v })),
            { ignoreDuplicates: true },
        );
    }

    async findAll(like: string) {
        return this.tagModel.findAll({
            where: {
                value: {
                    [Op.substring]: like || '',
                },
            },
        });
    }
}
