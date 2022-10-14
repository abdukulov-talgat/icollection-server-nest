import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { NopeObject } from 'nope-validator/lib/cjs/NopeObject';

export class NopeValidationPipe implements PipeTransform {
    constructor(private nopeObject: NopeObject) {}
    transform(value: any, metadata: ArgumentMetadata): any {
        const errors = this.nopeObject.validate(value);
        if (errors === undefined) {
            return value;
        }
        throw new BadRequestException(errors);
    }
}
