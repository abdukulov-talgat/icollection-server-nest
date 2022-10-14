import * as crypto from 'crypto';
import * as util from 'util';
import { REFRESH_SECRET_LENGTH } from '../constants/authorization';

const getRandomBytes = util.promisify(crypto.randomBytes);

export const generateToken = async () => {
    const bytes = await getRandomBytes(REFRESH_SECRET_LENGTH / 2);
    return bytes.toString('hex');
};
