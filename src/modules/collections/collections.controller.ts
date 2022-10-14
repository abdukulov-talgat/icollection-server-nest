import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';

@Controller('collections')
export class CollectionsController {
    constructor(private collectionsService: CollectionsService) {}

    @Get()
    findByQuery(@Query('userId', ParseIdPipe) userId: number) {
        return `Collections for user with ${userId} id`;
    }

    @Get('/:id')
    findOne(@Param('id', ParseIdPipe) id: number) {
        return `Get collection with ${id} id`;
    }

    @Post()
    create() {
        return 'Create Collection';
    }

    @Put(':id')
    update(@Param('id', ParseIdPipe) id: number) {
        return `Collection with ${id} is updated`;
    }

    @Delete(':id')
    delete(@Param('id', ParseIdPipe) id: number) {
        return `Collection with ${id} is deleted`;
    }
}
