import { AvailableRoles } from '../constants/authorization';
import { SelectUserDto } from '../../modules/users/dto/select-user.dto';

export const isAdmin = (user: SelectUserDto) => {
    return user.roles.includes(AvailableRoles.ADMIN);
};
