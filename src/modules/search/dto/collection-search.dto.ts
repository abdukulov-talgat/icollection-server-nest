import { Collection } from '../../collections/model/collection.model';

export class CollectionSearchDto {
    id: number;

    name: string;

    description: string;

    topic: string;

    constructor(collection: Collection) {
        this.id = collection.id;
        this.name = collection.name;
        this.description = collection.description;
        this.topic = collection.topic.value;
    }
}
