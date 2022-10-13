import { User } from '../model/user.model';

export class SelectUserDto {
    public readonly id: number;
    public readonly email: string;
    public readonly isBanned: boolean;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.isBanned = user.isBanned;
    }
}
