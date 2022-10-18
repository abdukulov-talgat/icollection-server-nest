import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from 'sequelize-typescript';
import { Collection } from '../../collections/model/collection.model';
import { ItemComment } from './item-comment.model';
import { ItemLike } from './item-like.model';
import { ItemTag } from './item-tag.model';
import { Tag } from '../../tags/model/tag.model';

@Table({ timestamps: false })
export class Item extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER({ unsigned: true }) })
    id: number;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: true, type: DataType.JSON() })
    customColumns: string;

    @Column({ allowNull: false, type: DataType.INTEGER({ unsigned: true }) })
    @ForeignKey(() => Collection)
    collectionId: number;

    @BelongsTo(() => Collection)
    collection: Collection;

    @HasMany(() => ItemComment)
    comments: Comment[];

    @HasMany(() => ItemLike)
    likes: ItemLike[];

    @BelongsToMany(() => Tag, () => ItemTag)
    tags: Tag[];
}
