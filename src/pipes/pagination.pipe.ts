import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

interface PaginationPipeConfig {
    defaultPage: number;
    defaultLimit: number;
}

export class PaginationPipe implements PipeTransform {
    constructor(private config: PaginationPipeConfig) {}

    transform(value: any, metadata: ArgumentMetadata): any {
        const result = {
            page: this.config.defaultPage,
            limit: this.config.defaultLimit,
        };
        if (value) {
            result.page = this.sanitize(value.page, this.config.defaultPage);
            result.limit = this.sanitize(value.limit, this.config.defaultLimit);
        }
        return result;
    }

    private sanitize(value: any, defaultValue: number): number {
        let result = Number.parseInt(value);
        result = Number.isNaN(result) ? defaultValue : result;
        return result < 1 ? defaultValue : result;
    }
}
