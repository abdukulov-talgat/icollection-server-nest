import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';
import { ACGuard, UseRoles } from 'nest-access-control';
import { Resources } from '../../common/constants/authorization';
import { ItemsCommentsService } from './items-comments.service';
import { PaginationQueryOptions } from '../../common/utils/query/query-options';
import { PaginationPipe } from '../../pipes/pagination.pipe';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { Request } from 'express';
import { SelectUserDto } from '../users/dto/select-user.dto';

@Controller('items/:itemId/comments')
export class ItemsCommentsController {
    constructor(private commentsService: ItemsCommentsService) {}

    @Get()
    @UsePipes(new PaginationPipe({ defaultPage: 1, defaultLimit: 5 }))
    findAll(@Param('itemId', ParseIdPipe) itemId: number, @Query() query: PaginationQueryOptions) {
        return this.commentsService.findAll(itemId, query);
    }

    @Post()
    @UseRoles({ action: 'create', resource: Resources.ITEMS_COMMENTS, possession: 'own' })
    @UseGuards(AccessJwtGuard, ACGuard)
    create(
        @Req() req: Request,
        @Param('itemId', ParseIdPipe) itemId: number,
        @Body('text') text: string,
    ) {
        const userId = (req.user as SelectUserDto).id;
        return this.commentsService.create({ itemId, text, userId });
    }
}
