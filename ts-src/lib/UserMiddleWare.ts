import { User } from '.prisma/client';
import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';

import JsonWebToken from './JsonWebToken';

declare module 'koa' {
    interface Context {
        loginedUser: User | null;
    }
}

export async function UserMiddleWare(
    ctx: Koa.Context,
    next: (ctx: Koa.Context) => Promise<any>
) {
    let token = ctx.cookies.get('access_token');
    if (!token) return next(ctx);

    try {
        let temp = await JsonWebToken.decodeToken(token);
        let decoded: jwt.JwtPayload;
        if (typeof temp !== 'string') {
            decoded = temp;
            let { _uuid, _user } = decoded;
            let uuid: string = _uuid;
            let user: User = _user;
            if (
                decoded !== undefined &&
                decoded.iat !== undefined &&
                Date.now() / 1000 - decoded.iat > 60 * 60 * 24
            ) {
                let freshToken = await JsonWebToken.generateToken({
                    uuid,
                    user,
                });
                ctx.cookies.set('access_token', freshToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
                    httpOnly: true,
                });
            }
            ctx.loginedUser = user;
        }
    } catch (e) {
        ctx.loginedUser = null;
    }

    return next(ctx);
}

export default UserMiddleWare;
