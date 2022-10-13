import { RefreshToken } from '../../auth/model/refresh-token.model';
import { Table, Column, DataType, HasMany, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
    @Column({ primaryKey: true, type: DataType.INTEGER({ unsigned: true }), autoIncrement: true })
    id: number;

    @Column({ unique: true, allowNull: false })
    email: string;

    @Column({ allowNull: false })
    passwordHash: string;

    @Column({ defaultValue: false })
    isBanned: boolean;

    @HasMany(() => RefreshToken)
    tokens: RefreshToken[];
}
