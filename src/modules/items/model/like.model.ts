import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/model/user.model';
import { Item } from './item.model';

@Table({ timestamps: false })
export class Like extends Model {
    @Column({ allowNull: false, type: DataType.INTEGER({ unsigned: true }), primaryKey: true })
    @ForeignKey(() => User)
    userId: number;

    @Column({ allowNull: false, type: DataType.INTEGER({ unsigned: true }), primaryKey: true })
    @ForeignKey(() => Item)
    itemId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Item)
    item: Item;
}
