import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { TagsService } from './tags.service';
import { PaginationPipe } from '../../pipes/pagination.pipe';
import { TagsQueryOptions } from '../../common/utils/query/query-options';

@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) {}

    @Post()
    create(@Body('tags') tags: string[]) {
        return this.tagsService.createMany(tags);
    }

    @Get()
    @UsePipes(new PaginationPipe({ defaultPage: 1, defaultLimit: 5 }))
    findAll(@Query() query: TagsQueryOptions) {
        return this.tagsService.findAll(query);
    }
}
