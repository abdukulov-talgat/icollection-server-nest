import { CustomColumnTypes } from '../constants/custom-column-types';
import { isJSON } from 'class-validator';

class CollectionSchemaValidator {
    isValid(schema?: any) {
        if (schema === undefined) {
            return true;
        }
        if (!isJSON(schema)) {
            return false;
        }
        const schemaObject = JSON.parse(schema);
        if (!Array.isArray(schemaObject)) {
            return false;
        }
        return this.validateSchema(schemaObject);
    }

    private validateSchema(schema: Array<any>) {
        const isInvalid = schema.some((it) => {
            if (it.type === undefined || !this.isCorrectType(it.type)) {
                return true;
            }
            if (typeof it.name !== 'string') {
                return true;
            }
        });
        return !isInvalid;
    }

    private isCorrectType(type: any) {
        return Object.values(CustomColumnTypes).includes(type);
    }
}

export default new CollectionSchemaValidator();
