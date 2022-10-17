import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from 'sequelize-typescript';
import { Topic } from '../../topics/model/topic.model';
import { User } from '../../users/model/user.model';
import { Item } from '../../items/model/item.model';

@Table({ timestamps: false })
export class Collection extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER({ unsigned: true }) })
    id: number;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false, type: DataType.TEXT })
    description: string;

    @Column({ allowNull: true })
    imageSrc: string;

    @Column({ allowNull: true, type: DataType.JSON })
    customColumns: string;

    @Column({ allowNull: false, type: DataType.SMALLINT({ unsigned: true }) })
    @ForeignKey(() => Topic)
    topicId: number;

    @Column({ allowNull: false, type: DataType.INTEGER({ unsigned: true }) })
    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => Topic)
    topic: Topic;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Item)
    items: Item[];
}
