import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/model/user.model';
import { Item } from './item.model';

@Table({ updatedAt: false })
export class ItemComment extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER({ unsigned: true }) })
    id: number;

    @Column({ allowNull: false })
    text: string;

    @Column({ allowNull: false, type: DataType.INTEGER({ unsigned: true }) })
    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @Column({ allowNull: false, type: DataType.INTEGER({ unsigned: true }) })
    @ForeignKey(() => Item)
    itemId: number;

    @BelongsTo(() => Item)
    item: Item;
}
