import { RefreshToken } from '../../auth/model/refresh-token.model';
import {
    Table,
    Column,
    DataType,
    HasMany,
    Model,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { Role } from '../../roles/model/role.model';

@Table
export class User extends Model {
    @Column({ primaryKey: true, type: DataType.INTEGER({ unsigned: true }), autoIncrement: true })
    id: number;

    @Column({ unique: true, allowNull: false })
    email: string;

    @Column({ allowNull: false })
    passwordHash: string;

    @Column({ defaultValue: false, allowNull: false })
    isBanned: boolean;

    @Column({ allowNull: false, type: DataType.TINYINT({ unsigned: true }) })
    @ForeignKey(() => Role)
    roleId: number;

    @BelongsTo(() => Role)
    role: Role;

    @HasMany(() => RefreshToken)
    tokens: RefreshToken[];
}
