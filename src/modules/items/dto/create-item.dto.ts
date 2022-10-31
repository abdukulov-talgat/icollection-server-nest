import Nope from 'nope-validator';

export class CreateItemDto {
    name: string;

    collectionId: number;

    userId: number;

    tags: string[];

    customColumns?: string;
}

export const createItemDtoSchema = Nope.object().shape({
    name: Nope.string().required(),

    collectionId: Nope.number().required().greaterThan(0),

    userId: Nope.number().required().greaterThan(0),

    tags: Nope.array<string>(),

    customColumns: Nope.string(),
});
