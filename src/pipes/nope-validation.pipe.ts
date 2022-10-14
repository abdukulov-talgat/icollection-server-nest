import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { NopeObject } from 'nope-validator/lib/cjs/NopeObject';

export class NopeValidationPipe implements PipeTransform {
    constructor(private nopeObject: NopeObject) {}
    transform(value: any, metadata: ArgumentMetadata): any {
        if (this.nopeObject.validate(value) === undefined) {
            return value;
        }
        throw new BadRequestException('Nope Pipe Bad REQUEST! remove later this'); //TODO: Delete message
    }
}
