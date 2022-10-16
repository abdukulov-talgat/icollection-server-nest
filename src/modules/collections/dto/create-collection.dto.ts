export class CreateCollectionDto {
    name: string;

    description: string;

    imageSrc?: string;

    topicId: number;

    customColumns: string;

    userId?: number;
}
