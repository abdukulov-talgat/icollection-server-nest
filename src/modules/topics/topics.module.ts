import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Topic } from './model/topic.model';

@Module({
    imports: [SequelizeModule.forFeature([Topic])],
    providers: [TopicsService],
    controllers: [TopicsController],
})
export class TopicsModule {}
