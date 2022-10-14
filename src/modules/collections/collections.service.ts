import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from './model/collection.model';

@Injectable()
export class CollectionsService {
    constructor(@InjectModel(Collection) collectionModel: typeof Collection) {}
}
