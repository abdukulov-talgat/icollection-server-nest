import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class ParseStringPipe implements PipeTransform {
    constructor(private minLength: number, private maxLength: number) {}
    transform(value: any, metadata: ArgumentMetadata) {
        if (
            typeof value === 'string' &&
            value.length >= this.minLength &&
            value.length <= this.maxLength
        ) {
            return value;
        }
        throw new BadRequestException();
    }
}
