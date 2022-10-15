export class CreateCollectionDto {
    name: string;

    description: string;

    imageSrc?: string;

    topicId: number;

    userId: number;

    customColumns: string;
}
