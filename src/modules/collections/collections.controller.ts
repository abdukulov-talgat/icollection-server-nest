import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    NotFoundException,
    Param,
    ParseFilePipe,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';
import { PaginationPipe } from '../../pipes/pagination.pipe';
import { CreateCollectionDto, createCollectionDtoSchema } from './dto/create-collection.dto';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { Request } from 'express';
import { ACGuard, UseRoles } from 'nest-access-control';
import { SelectUserDto } from '../users/dto/select-user.dto';
import { resolveResourceOwner } from '../../common/utils/resolve-resource-owner';
import { EditCollectionDto, editCollectionDtoSchema } from './dto/edit-collection.dto';
import { CollectionsQueryOptions } from '../../common/utils/query/query-options';
import { FileInterceptor } from '@nestjs/platform-express';
import { NopeValidationPipe } from '../../pipes/nope-validation.pipe';
import { resolveImageSrc } from '../../common/utils/resolve-image-src';
import CollectionSchemaValidator from '../../common/lib/collection-schema-validator';
import { ItemsService } from '../items/items.service';

@Controller('collections')
export class CollectionsController {
    constructor(
        private collectionsService: CollectionsService,
        private itemsService: ItemsService,
    ) {}

    private handleWrongSchema = (customColumns?: string) => {
        if (!CollectionSchemaValidator.isValid(customColumns)) {
            throw new BadRequestException('NOT VALID SCHEMA');
        }
    };

    @Get()
    @UsePipes(new PaginationPipe({ defaultPage: 1, defaultLimit: 5 }))
    findAll(@Query() query: CollectionsQueryOptions) {
        try {
            return this.collectionsService.findAll(query);
        } catch (e) {
            throw new BadRequestException('Wrong query?');
        }
    }

    @Get(':id')
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
    @UseInterceptors(FileInterceptor('img'))
    async create(
        @Req() req: Request,
        @Body(new NopeValidationPipe(createCollectionDtoSchema))
        body: Omit<CreateCollectionDto, 'imageSrc'>,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: false,
                validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ })],
            }),
        )
        img?: Express.Multer.File,
    ) {
        this.handleWrongSchema(body.customColumns);
        const dto = resolveResourceOwner<CreateCollectionDto>(req.user as SelectUserDto, body);
        dto.imageSrc = await resolveImageSrc(img);
        const collection = await this.collectionsService.create(dto);
        if (!collection) {
            throw new BadRequestException();
        }
        return collection;
    }

    @Put()
    @UseGuards(AccessJwtGuard, ACGuard)
    @UseRoles({ action: 'update', resource: 'collection', possession: 'own' })
    async edit(
        @Req() req: Request,
        @Body(new NopeValidationPipe(editCollectionDtoSchema))
        body: Omit<EditCollectionDto, 'imageSrc'>,
        @UploadedFile(
            new ParseFilePipe({
                fileIsRequired: false,
                validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)/ })],
            }),
        )
        img?: Express.Multer.File,
    ) {
        this.handleWrongSchema(body.customColumns);
        const dto = resolveResourceOwner<EditCollectionDto>(req.user as SelectUserDto, body);
        dto.imageSrc = await resolveImageSrc(img);
        const collection = await this.collectionsService.edit(dto);
        if (collection) {
            await this.itemsService.removeAllItemsForCollection(collection.id);
            return collection;
        }
        throw new BadRequestException();
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
        const isSuccess = await this.collectionsService.remove(id, resolvedUserId as number);
        if (isSuccess) {
            return { result: true, message: `Collection with ID ${id} is deleted` };
        }
        throw new BadRequestException();
    }
}
