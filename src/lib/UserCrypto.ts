import { promisify } from 'util';
import * as crypto from 'crypto';

const randomBytesAsync = promisify(crypto.randomBytes);

export class UserCrypto {
    static async createRandomSalt() {
        try {
            return (await randomBytesAsync(64)).toString('base64');
        } catch (e) {
            throw e;
        }
    }

    static async makePasswordHashed(password: string, salt: string) {
        let hashed = crypto
            .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
            .toString('base64');

        return hashed;
    }
}

export default UserCrypto;
