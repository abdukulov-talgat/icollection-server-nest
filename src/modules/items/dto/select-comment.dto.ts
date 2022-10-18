import { SelectUserDto } from '../../users/dto/select-user.dto';
import { ItemComment } from '../model/item-comment.model';

export class SelectCommentDto {
    id: number;

    text: string;

    user: SelectUserDto;

    itemId: number;

    constructor(comment: ItemComment) {
        this.id = comment.id;
        this.text = comment.text;
        this.user = new SelectUserDto(comment.user);
        this.itemId = comment.itemId;
    }
}
