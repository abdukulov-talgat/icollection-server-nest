import Nope from 'nope-validator';

export class CreateCollectionDto {
    name: string;

    description: string;

    imageSrc?: string;

    topicId: number;

    customColumns?: string;

    userId?: number;
}

export const createCollectionDtoSchema = Nope.object().shape({
    name: Nope.string().required(),

    description: Nope.string().required(),

    topicId: Nope.number().required().greaterThan(0),

    userId: Nope.number().greaterThan(0),
});
