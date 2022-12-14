import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Get()
    async search(@Query('query') query: string) {
        return this.searchService.search(query);
    }

    @Get('tags')
    async tags(@Query('tags') tags: string) {
        return this.searchService.tags(tags);
    }
}
