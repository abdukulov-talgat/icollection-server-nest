import { SelectUserDto } from '../../users/dto/select-user.dto';

export interface JwtUserPayload extends SelectUserDto {
    iat: number;
    exp: number;
}
