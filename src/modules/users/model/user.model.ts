import { RefreshToken } from '../../auth/model/refresh-token.model';
import {
    Table,
    Column,
    DataType,
    HasMany,
    Model,
    ForeignKey,
    BelongsTo,
    BelongsToMany,
} from 'sequelize-typescript';
import { Role, UserRole } from '../../roles/model/role.model';
import { Collection } from '../../collections/model/collection.model';

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

    @BelongsToMany(() => Role, () => UserRole)
    roles: Role[];

    @HasMany(() => RefreshToken)
    tokens: RefreshToken[];

    @HasMany(() => Collection)
    collections: Collection[];
}
