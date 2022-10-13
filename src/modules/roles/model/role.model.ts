import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/model/user.model';

@Table({ timestamps: false })
export class Role extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.TINYINT({ unsigned: true }) })
    id: number;

    @Column({ unique: true, allowNull: false, type: DataType.STRING({ length: 30 }) })
    value: string;

    @HasMany(() => User)
    users: User[];
}
