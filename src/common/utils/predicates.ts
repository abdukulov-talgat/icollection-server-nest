import { SelectUserDto } from '../../modules/users/dto/select-user.dto';

export const isSelectUserDto = (input: any): input is SelectUserDto => {
    return input && typeof input.role === 'string';
};
