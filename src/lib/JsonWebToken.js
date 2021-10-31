import * as jwt from 'jsonwebtoken';

import 'dotenv/config';

const SECRET_KEY =
    process.env.JWT_SECRET !== undefined
        ? process.env.JWT_SECRET
        : 'BLOCEBSECRETKEY';

export class JsonWebToken {
    static async generateToken(payload) {
        return await jwt.sign(payload, SECRET_KEY, {
            expiresIn: '7d',
        });
    }

    static async decodeToken(token) {
        return await jwt.verify(token, SECRET_KEY);
    }
}

export default JsonWebToken;
