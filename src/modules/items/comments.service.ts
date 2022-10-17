import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './model/comment.model';
import { mapPageToOffset } from '../../common/utils/helpers';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationQueryOptions } from '../../common/utils/query/query-options';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment) private commentModel: typeof Comment) {}

    findAll(itemId: number, { page, limit }: PaginationQueryOptions) {
        return this.commentModel.findAll({
            where: {
                itemId: itemId,
            },
            offset: mapPageToOffset(page as number, limit as number),
            limit: limit,
        });
    }

    create(createCommentDto: CreateCommentDto) {
        return this.commentModel.create({ ...createCommentDto });
    }
}
