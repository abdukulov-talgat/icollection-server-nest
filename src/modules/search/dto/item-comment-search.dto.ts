import { ItemComment } from '../../items/model/item-comment.model';

export class ItemCommentSearchDto {
    id: number;

    text: string;

    itemId: number;

    userId: number;

    constructor(comment: ItemComment) {
        this.id = comment.id;
        this.text = comment.text;
        this.itemId = comment.itemId;
        this.userId = comment.userId;
    }
}
