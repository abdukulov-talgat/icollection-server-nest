import { CustomColumnTypes } from '../constants/custom-column-types';

type CustomColumnTypesKeys = keyof typeof CustomColumnTypes;

export interface CustomColumnField {
    type: typeof CustomColumnTypes[CustomColumnTypesKeys];
    name: string;
}
