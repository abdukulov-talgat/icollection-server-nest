import { CreateCollectionDto } from './create-collection.dto';
import Nope from 'nope-validator';

export class EditCollectionDto extends CreateCollectionDto {
    id: number;
}

export const editCollectionDtoSchema = Nope.object().shape({
    id: Nope.number().required().greaterThan(0),

    name: Nope.string().required(),

    description: Nope.string().required(),

    topicId: Nope.number().required().greaterThan(0),

    userId: Nope.number().greaterThan(0),
});
