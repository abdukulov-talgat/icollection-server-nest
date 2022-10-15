import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/model/user.model';

@Table({ timestamps: false })
export class Role extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.TINYINT({ unsigned: true }) })
    id: number;

    @Column({ unique: true, allowNull: false, type: DataType.STRING({ length: 30 }) })
    value: string;

    @BelongsToMany(() => User, () => UserRole)
    users: User[];
}

@Table({ timestamps: false })
export class UserRole extends Model {
    @Column
    @ForeignKey(() => Role)
    roleId: number;

    @Column
    @ForeignKey(() => User)
    userId: number;
}
