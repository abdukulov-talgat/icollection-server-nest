import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import {
    ELASTIC_CLIENT_ID,
    ELASTIC_PASSWORD,
    ELASTIC_USERNAME,
} from '../../common/constants/environment';
import { SearchController } from './search.controller';
import { ItemsModule } from '../items/items.module';

@Module({
    imports: [
        ElasticsearchModule.register({
            cloud: {
                id: ELASTIC_CLIENT_ID,
            },
            auth: {
                username: ELASTIC_USERNAME,
                password: ELASTIC_PASSWORD,
            },
        }),
        ItemsModule,
    ],
    providers: [SearchService],
    controllers: [SearchController],
})
export class SearchModule {}
