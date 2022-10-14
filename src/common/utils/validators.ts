//TODO: Replace with pipes.
import { SignUpDto } from '../../modules/auth/dto/sign-up.dto';
import Nope from 'nope-validator';

const signUpSchema = Nope.object().shape({
    email: Nope.string().email().required(),
    password: Nope.string().required().min(7),
    passwordRepeat: Nope.string()
        .required()
        .oneOf([Nope.ref('password')]),
});

export const validateSignUp = (signUpDto: SignUpDto) => {
    return signUpSchema.validate(signUpDto) === undefined;
};
