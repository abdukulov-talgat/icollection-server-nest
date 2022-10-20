import { Item } from '../../items/model/item.model';

export class ItemSearchDto {
    id: number;

    name: string;

    customColumns?: string[];

    tags: string[];

    constructor({ id, name, customColumns, tags }: Item) {
        console.log(customColumns);
        this.id = id;
        this.name = name;
        this.customColumns =
            customColumns &&
            (customColumns.filter((it: unknown) => typeof it === 'string') as string[]);
        this.tags = tags.map((t) => t.value);
    }
}
