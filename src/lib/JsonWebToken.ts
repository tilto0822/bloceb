import * as jwt from 'jsonwebtoken';

import 'dotenv/config';

const SECRET_KEY: string =
    process.env.JWT_SECRET !== undefined
        ? process.env.JWT_SECRET
        : 'BLOCEBSECRETKEY';

export class JsonWebToken {
    public static async generateToken(payload: object): Promise<string> {
        return await jwt.sign(payload, SECRET_KEY, {
            expiresIn: '7d',
        });
    }

    public static async decodeToken(
        token: string
    ): Promise<string | jwt.JwtPayload> {
        return await jwt.verify(token, SECRET_KEY);
    }
}

export default JsonWebToken;
