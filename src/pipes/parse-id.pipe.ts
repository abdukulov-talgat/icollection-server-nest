import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const number = Number.parseInt(value);
        if (Number.isFinite(number) && number > 0) {
            return number;
        }
        throw new BadRequestException();
    }
}
