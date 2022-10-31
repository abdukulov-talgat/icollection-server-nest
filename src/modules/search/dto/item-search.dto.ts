import { Item } from '../../items/model/item.model';

export class ItemSearchDto {
    id: number;

    collectionId: number;

    name: string;

    customColumns: string[] | null;

    tags: string[];

    constructor({ id, collectionId, name, customColumns, tags }: Item) {
        this.id = id;
        this.collectionId = collectionId;
        this.name = name;
        this.customColumns = customColumns ? Object.values(customColumns) : null;
        this.tags = tags.map((t) => t.value);
    }
}
