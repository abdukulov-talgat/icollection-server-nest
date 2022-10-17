import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Collection } from '../../collections/model/collection.model';

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
}
