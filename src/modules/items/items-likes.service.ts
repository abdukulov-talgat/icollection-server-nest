import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ItemLike } from './model/item-like.model';
import { FindOptions } from 'sequelize/types/model';

@Injectable()
export class ItemsLikesService {
    constructor(@InjectModel(ItemLike) private likeModel: typeof ItemLike) {}

    findOne(options: FindOptions) {
        return this.likeModel.findOne(options);
    }

    async create(userId: number, itemId: number) {
        try {
            return await this.likeModel.create({ userId, itemId });
        } catch {
            return null;
        }
    }

    async delete(userId: number, itemId: number) {
        const exist = await this.likeModel.findOne({ where: { userId, itemId } });
        if (exist) {
            await exist.destroy();
            return true;
        }
        return false;
    }
}
