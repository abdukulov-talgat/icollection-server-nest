import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';
import { PaginationPipe } from '../../pipes/pagination.pipe';
import { FindCollectionsQuery } from './dto/find-collections.query';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { Request } from 'express';
import { ACGuard, UseRoles } from 'nest-access-control';

@Controller('collections')
export class CollectionsController {
    constructor(private collectionsService: CollectionsService) {}

    @Get()
    @UsePipes(new PaginationPipe({ defaultPage: 1, defaultLimit: 5 }))
    findAll(@Query() query: FindCollectionsQuery) {
        try {
            return this.collectionsService.findAll(query);
        } catch (e) {
            console.log(e);
            throw new BadRequestException('Wrong query?');
        }
    }

    @Get('/:id')
    async findOne(@Param('id', ParseIdPipe) id: number) {
        const collection = await this.collectionsService.findCollectionById(id);
        if (collection) {
            return collection;
        }
        throw new NotFoundException();
    }

    @Post()
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'create', resource: 'collection', possession: 'own' })
    async create(
        @Req() req: Request,
        @Body() createCollectionDto: Omit<CreateCollectionDto, 'userId'>,
    ) {
        console.log(JSON.stringify(req.user));
        const userId = (req.user as any).id as number;
        const collection = await this.collectionsService.create({ ...createCollectionDto, userId });
        if (!collection) {
            throw new BadRequestException();
        }
        return collection;
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
