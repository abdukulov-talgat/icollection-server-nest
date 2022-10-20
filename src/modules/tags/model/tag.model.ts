import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Item } from '../../items/model/item.model';
import { ItemTag } from '../../items/model/item-tag.model';

@Table({ timestamps: false })
export class Tag extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER({ unsigned: true }) })
    id: number;

    @Column({ allowNull: false, unique: true })
    value: string;

    @BelongsToMany(() => Item, () => ItemTag)
    items: Item[];
}
