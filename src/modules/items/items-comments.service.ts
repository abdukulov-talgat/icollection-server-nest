import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ItemComment } from './model/item-comment.model';
import { mapPageToOffset } from '../../common/utils/helpers';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryOptions } from '../../common/utils/query/query-options';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../users/model/user.model';
import { Role } from '../roles/model/role.model';
import { SelectCommentDto } from './dto/select-comment.dto';
import { AppEvents } from '../../common/constants/app-events';

@Injectable()
export class ItemsCommentsService {
    constructor(
        @InjectModel(ItemComment) private commentModel: typeof ItemComment,
        private eventEmitter: EventEmitter2,
    ) {}

    async findAll(itemId: number, { page, limit }: PaginationQueryOptions) {
        const comments = await this.commentModel.findAll({
            where: {
                itemId: itemId,
            },
            offset: mapPageToOffset(page as number, limit as number),
            include: {
                model: User,
                include: [Role],
            },
            limit: limit,
        });
        return comments.map((c) => new SelectCommentDto(c));
    }

    async create(createCommentDto: CreateCommentDto) {
        try {
            const newComment = await this.commentModel.create({ ...createCommentDto });
            const comment = await this.commentModel.findByPk(newComment.id, {
                include: {
                    model: User,
                    include: [Role],
                },
            });
            const commentDto = new SelectCommentDto(comment as ItemComment);
            this.eventEmitter.emit(AppEvents.ITEM_COMMENT_CREATE_EVENT, commentDto);
            return commentDto;
        } catch {
            return null;
        }
    }
}
