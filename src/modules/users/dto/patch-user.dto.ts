import Nope from 'nope-validator';

export class PatchUserDto {
    id: number;

    email: string;

    isBanned: boolean;

    isAdmin: boolean;
}

export const patchUserDtoSchema = Nope.object().shape({
    id: Nope.number().required().greaterThan(0),
    email: Nope.string().required().email(),
    isBanned: Nope.boolean().required(),
    isAdmin: Nope.boolean().required(),
});
