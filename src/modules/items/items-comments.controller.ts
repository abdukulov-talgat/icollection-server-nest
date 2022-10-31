import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';
import { ItemsCommentsService } from './items-comments.service';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { Request } from 'express';
import { SelectUserDto } from '../users/dto/select-user.dto';

@Controller('items/:itemId/comments')
export class ItemsCommentsController {
    constructor(private commentsService: ItemsCommentsService) {}

    @Get()
    findAll(@Param('itemId', ParseIdPipe) itemId: number) {
        return this.commentsService.findAll(itemId);
    }

    @Post()
    @UseGuards(AccessJwtGuard)
    async create(
        @Req() req: Request,
        @Param('itemId', ParseIdPipe) itemId: number,
        @Body('text') text: string,
    ) {
        const userId = (req.user as SelectUserDto).id;
        const comment = await this.commentsService.create({ itemId, text, userId });
        if (comment) {
            return comment;
        }
        return new BadRequestException();
    }
}
