import { User } from '../model/user.model';
import { AvailableRoles } from '../../../common/constants/authorization';

export class SelectUserDto {
    id: number;
    email: string;
    isBanned: boolean;
    roles: AvailableRoles[];

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.isBanned = user.isBanned;
        this.roles = user.roles.map((r) => r.value) as AvailableRoles[];
    }
}
