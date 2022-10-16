import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './model/collection.model';
import { CollectionsQueryBuilder, CollectionsQueryDirector } from './collections.helpers';
import { FindCollectionsQuery } from './dto/find-collections.query';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Topic } from '../topics/model/topic.model';
import { EditCollectionDto } from './dto/edit-collection.dto';

@Injectable()
export class CollectionsService {
    constructor(@InjectModel(Collection) private collectionModel: typeof Collection) {}

    findAll(query: FindCollectionsQuery) {
        const builder = new CollectionsQueryBuilder();
        const director = new CollectionsQueryDirector(builder);
        director.build(query);
        const sequelizeQuery = builder.getResult();
        return this.collectionModel.findAll({
            ...sequelizeQuery,
            include: [Topic],
        });
    }

    findCollectionById(id: number) {
        return this.collectionModel.findByPk(id, { include: [Topic] });
    }

    async create(createCollectionDto: CreateCollectionDto) {
        try {
            return await this.collectionModel.create({
                ...createCollectionDto,
            });
        } catch (e) {
            return null;
        }
    }

    async edit({ id, userId, ...body }: EditCollectionDto) {
        try {
            const collection = await this.collectionModel.findOne({
                where: {
                    id: id,
                    userId: userId,
                },
            });
            if (collection) {
                return await collection.update({ ...body });
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async remove(id: number, userId: number) {
        try {
            const count = await this.collectionModel.destroy({
                where: { id: id, userId: userId },
            });
            return count === 1;
        } catch (e) {
            return null;
        }
    }
}
