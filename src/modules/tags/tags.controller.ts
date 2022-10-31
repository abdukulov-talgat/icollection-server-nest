import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) {}

    @Post()
    create(@Body('tags') tags: string[]) {
        return this.tagsService.createMany(tags);
    }

    @Get()
    findAll(@Query('like') like: string) {
        return this.tagsService.findAll(like);
    }
}
