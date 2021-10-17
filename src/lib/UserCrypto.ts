import { promisify } from 'util';
import * as crypto from 'crypto';
import { PrismaClient } from '.prisma/client';

const randomBytesAsync = promisify(crypto.randomBytes);

export class UserCrypto {
    public static async createRandomSalt(): Promise<string> {
        try {
            return (await randomBytesAsync(64)).toString('base64');
        } catch (e) {
            throw e;
        }
    }

    public static async createHasehdPassword(
        password: string
    ): Promise<{ password: string; salt: string }> {
        let salt = await UserCrypto.createRandomSalt();
        let key = await crypto
            .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
            .toString('base64');
        return {
            password: key,
            salt: salt,
        };
    }

    public static async makePasswordHashed(
        userId: string,
        password: string
    ): Promise<string> {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                loginId: userId,
            },
        });
        if (user == null) {
            return '';
        }
        let salt = user.pwsalt;
        prisma.$disconnect();

        let hashed = crypto
            .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
            .toString('base64');

        return hashed;
    }
}

export default UserCrypto;
