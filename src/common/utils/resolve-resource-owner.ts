import { SelectUserDto } from '../../modules/users/dto/select-user.dto';
import { isAdmin } from './auth';

interface ResourceDto {
    userId?: number;
}

export const resolveResourceOwner = <T extends ResourceDto>(
    user: SelectUserDto,
    resourceDto: T,
) => {
    resourceDto.userId =
        isAdmin(user) && resourceDto.userId !== undefined ? resourceDto.userId : user.id;
    return resourceDto;
};
