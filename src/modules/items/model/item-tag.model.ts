import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Tag } from '../../tags/model/tag.model';
import { Item } from './item.model';

@Table({ timestamps: false })
export class ItemTag extends Model {
    @Column({ allowNull: false, type: DataTypes.INTEGER({ unsigned: true }) })
    @ForeignKey(() => Item)
    itemId: number;

    @Column({ allowNull: false, type: DataTypes.INTEGER({ unsigned: true }) })
    @ForeignKey(() => Tag)
    tagId: number;
}
