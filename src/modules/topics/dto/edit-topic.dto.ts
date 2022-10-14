import { TOPIC_VALUE_MAX_LENGTH } from '../model/topic.model';
import Nope from 'nope-validator';

export class EditTopicDto {
    id: number;

    value: string;
}

export const editTopicDtoSchema = Nope.object().shape({
    id: Nope.number().required().greaterThan(0),

    value: Nope.string()
        .required()
        .greaterThan(2)
        .lessThan(TOPIC_VALUE_MAX_LENGTH + 1),
});
