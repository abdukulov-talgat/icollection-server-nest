import {
    BadRequestException,
    Controller,
    Delete,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ItemsLikesService } from './items-likes.service';
import { AccessJwtGuard } from '../../guards/access-jwt.guard';
import { Request } from 'express';
import { ParseIdPipe } from '../../pipes/parse-id.pipe';
import { SelectUserDto } from '../users/dto/select-user.dto';

@Controller('items/:itemId/likes')
export class ItemsLikesController {
    constructor(private likesService: ItemsLikesService) {}

    @Post()
    @UseGuards(AccessJwtGuard)
    async create(@Req() req: Request, @Param('itemId', ParseIdPipe) itemId: number) {
        const userId = (req.user as SelectUserDto).id;
        const like = await this.likesService.create(userId, itemId);
        if (!like) {
            throw new BadRequestException();
        }
        return like;
    }

    @Delete()
    @UseGuards(AccessJwtGuard)
    async delete(@Req() req: Request, @Param('itemId', ParseIdPipe) itemId: number) {
        const userId = (req.user as SelectUserDto).id;
        const exist = await this.likesService.findOne({ where: { userId, itemId } });
        if (exist) {
            await exist.destroy();
            return { result: true, message: `Like for item ID ${itemId} removed` };
        }
        throw new BadRequestException();
    }
}
