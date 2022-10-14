import { TOPIC_VALUE_MAX_LENGTH } from '../model/topic.model';
import Nope from 'nope-validator';

export class CreateTopicDto {
    value: string;
}

export const createTopicTdoSchema = Nope.object().shape({
    value: Nope.string()
        .required()
        .greaterThan(2)
        .lessThan(TOPIC_VALUE_MAX_LENGTH + 1),
});
