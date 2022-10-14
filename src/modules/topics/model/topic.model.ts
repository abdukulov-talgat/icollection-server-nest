import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Collection } from '../../collections/model/collection.model';

export const TOPIC_VALUE_MAX_LENGTH = 60;

@Table({ timestamps: false })
export class Topic extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.SMALLINT({ unsigned: true }) })
    id: number;

    @Column({
        unique: true,
        allowNull: false,
        type: DataType.STRING({ length: TOPIC_VALUE_MAX_LENGTH }),
    })
    value: string;

    @HasMany(() => Collection)
    collections: Collection[];
}
