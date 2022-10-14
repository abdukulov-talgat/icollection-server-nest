import Nope from 'nope-validator';

export class SignUpDto {
    email: string;

    password: string;

    passwordRepeat: string;
}

export const signUpDtoSchema = Nope.object().shape({
    email: Nope.string().email().required(),

    password: Nope.string().required().greaterThan(7),

    passwordRepeat: Nope.string()
        .required()
        .oneOf([Nope.ref('password')]),
});
