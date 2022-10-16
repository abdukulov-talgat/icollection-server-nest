import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
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
import { User } from '../users/model/user.model';
import { AvailableRoles } from '../../common/constants/authorization';
import { SelectUserDto } from '../users/dto/select-user.dto';
import { isAdmin } from '../../common/utils/auth';
import { resolveResourceOwner } from '../../common/utils/resolve-resource-owner';
import { EditCollectionDto } from './dto/edit-collection.dto';

@Controller('collections')
export class CollectionsController {
    constructor(private collectionsService: CollectionsService) {}

    @Get()
    @UsePipes(new PaginationPipe({ defaultPage: 1, defaultLimit: 5 }))
    findAll(@Query() query: FindCollectionsQuery) {
        try {
            return this.collectionsService.findAll(query);
        } catch (e) {
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
    async create(@Req() req: Request, @Body() createCollectionDto: CreateCollectionDto) {
        createCollectionDto = resolveResourceOwner<CreateCollectionDto>(
            req.user as SelectUserDto,
            createCollectionDto,
        );
        const collection = await this.collectionsService.create(createCollectionDto);
        if (!collection) {
            throw new BadRequestException();
        }
        return collection;
    }

    @Put()
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'update', resource: 'collection', possession: 'own' })
    async edit(@Req() req: Request, @Body() editCollectionDto: EditCollectionDto) {
        editCollectionDto = resolveResourceOwner<EditCollectionDto>(
            req.user as SelectUserDto,
            editCollectionDto,
        );
        const collection = await this.collectionsService.edit(editCollectionDto);
        if (!collection) {
            throw new BadRequestException();
        }
        return collection;
    }

    @Delete(':id')
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'delete', resource: 'collection', possession: 'own' })
    async delete(
        @Req() req: Request,
        @Param('id', ParseIdPipe) id: number,
        @Body('userId') userId?: number,
    ) {
        console.log('HERE');
        const { userId: resolvedUserId } = resolveResourceOwner(req.user as SelectUserDto, {
            userId: userId,
        });
        const isSuccess = await this.collectionsService.remove(id, resolvedUserId as number);
        if (isSuccess) {
            return { result: true, message: `Collection with ID ${id} is deleted` };
        }
        throw new BadRequestException();
    }
}
