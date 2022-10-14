import { User } from '../../users/model/user.model';
import { BelongsTo, Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { REFRESH_SECRET_LENGTH } from '../../../common/constants/authorization';

@Table({ updatedAt: false, createdAt: false })
export class RefreshToken extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER({ unsigned: true }) })
    id: number;

    @Column({ unique: true, allowNull: false, type: DataType.CHAR(REFRESH_SECRET_LENGTH) })
    token: string;

    @Column({ allowNull: false, type: DataType.INTEGER({ unsigned: true }) })
    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @Column({ allowNull: false, type: DataType.DATE })
    @Index
    expiredAt: Date;
}
