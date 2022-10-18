import { RefreshToken } from '../../auth/model/refresh-token.model';
import { Table, Column, DataType, HasMany, Model, BelongsToMany } from 'sequelize-typescript';
import { Role, UserRole } from '../../roles/model/role.model';
import { Collection } from '../../collections/model/collection.model';
import { ItemComment } from '../../items/model/item-comment.model';
import { ItemLike } from '../../items/model/item-like.model';

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

    @HasMany(() => ItemComment)
    comments: Comment[];

    @HasMany(() => ItemLike)
    likes: ItemLike[];
}
