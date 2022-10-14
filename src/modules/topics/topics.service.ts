import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Topic } from './model/topic.model';
import { CreateTopicDto } from './dto/create-topic.dto';
import { EditTopicDto } from './dto/edit-topic.dto';

@Injectable()
export class TopicsService {
    constructor(@InjectModel(Topic) private topicModel: typeof Topic) {}

    findAll() {
        return this.topicModel.findAll();
    }

    async create({ value }: CreateTopicDto) {
        const exist = await this.topicModel.findOne({ where: { value: value } });
        if (!exist) {
            return this.topicModel.create({ value: value });
        }
        return null;
    }

    async edit({ id, value }: EditTopicDto) {
        try {
            const exist = await this.topicModel.findByPk(id);
            if (!exist) {
                return null;
            }
            exist.value = value;
            return exist.save();
        } catch (e) {
            return null;
        }
    }

    async delete(id: number) {
        return this.topicModel.destroy({ where: { id: id } });
    }
}
