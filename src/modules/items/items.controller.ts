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
import { ItemsService } from './items.service';
import { PaginationPipe } from '../../pipes/pagination.pipe';
import { ItemsQueryOptions } from '../../common/utils/query/query-options';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { ACGuard, UseRoles } from 'nest-access-control';
import { Request } from 'express';
import { resolveResourceOwner } from '../../common/utils/resolve-resource-owner';
import { SelectUserDto } from '../users/dto/select-user.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { CollectionsService } from '../collections/collections.service';
import { Resources } from '../../common/constants/authorization';
import { EditItemDto } from './dto/edit-item.dto';

@Controller('items')
export class ItemsController {
    constructor(
        private itemsService: ItemsService,
        private collectionsService: CollectionsService,
    ) {}

    private async isCollectionOwner(collectionId: number, userId: number) {
        const collection = await this.collectionsService.findCollectionById(collectionId);
        if (collection && collection.userId === userId) {
            return true;
        }
        return false;
    }

    @Get()
    @UsePipes(new PaginationPipe({ defaultPage: 1, defaultLimit: 5 }))
    findAll(@Query() query: ItemsQueryOptions) {
        try {
            return this.itemsService.findAll(query);
        } catch (e) {
            throw new BadRequestException('Wrong query?');
        }
    }

    @Get(':id')
    async findOne(@Param('id', ParseIdPipe) id: number) {
        const collection = await this.itemsService.findItemById(id);
        if (collection) {
            return collection;
        }
        throw new NotFoundException();
    }

    @Post()
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'create', resource: Resources.ITEMS, possession: 'own' })
    async create(@Req() req: Request, @Body() createItemDto: CreateItemDto) {
        createItemDto = resolveResourceOwner<CreateItemDto>(
            req.user as SelectUserDto,
            createItemDto,
        );
        const isOwner = await this.isCollectionOwner(
            createItemDto.collectionId,
            createItemDto.userId as number,
        );
        if (!isOwner) {
            throw new BadRequestException();
        }
        const item = await this.itemsService.create(createItemDto);
        if (!item) {
            throw new BadRequestException();
        }
        return item;
    }

    @Put()
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'update', resource: Resources.ITEMS, possession: 'own' })
    async edit(@Req() req: Request, @Body() editItemDto: EditItemDto) {
        editItemDto = resolveResourceOwner<EditItemDto>(req.user as SelectUserDto, editItemDto);
        const isOwner = await this.isCollectionOwner(
            editItemDto.collectionId,
            editItemDto.userId as number,
        );
        if (!isOwner) {
            throw new BadRequestException();
        }
        const item = await this.itemsService.edit(editItemDto);
        if (!item) {
            throw new BadRequestException();
        }
        return editItemDto;
    }

    @Delete(':id')
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'delete', resource: 'collection', possession: 'own' })
    async delete(
        @Req() req: Request,
        @Param('id', ParseIdPipe) id: number,
        @Body('userId') userId?: number,
    ) {
        const { userId: resolvedUserId } = resolveResourceOwner(req.user as SelectUserDto, {
            userId: userId,
        });
        const item = await this.itemsService.findItemById(id);
        if (item && (await this.isCollectionOwner(item.collectionId, resolvedUserId as number))) {
            await this.itemsService.remove(item.id);
            return { result: true, message: `Item with ID ${id} is deleted` };
        }
        throw new BadRequestException();
    }
}
