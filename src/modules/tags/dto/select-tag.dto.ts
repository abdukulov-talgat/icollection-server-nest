import { Tag } from '../model/tag.model';

export class SelectTagDto {
    id: number;

    value: string;

    constructor({ id, value }: Tag) {
        this.id = id;
        this.value = value;
    }
}
