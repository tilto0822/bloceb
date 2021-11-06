import { User } from '@prisma/client';
import { Context } from 'koa';
import UserAPIRouter from '../routes/UserAPI';

import JsonWebToken from './JsonWebToken';

declare module 'koa' {
    interface BaseContext {
        loginedUser: User | null;
    }
}

export async function UserMiddleWare(ctx: Context, next: any) {
    let token = ctx.cookies.get('access_token');
    if (!token || typeof token !== 'string') {
        ctx.loginedUser = null;
        return next(ctx);
    }

    try {
        let decoded = await JsonWebToken.decodeToken(token);
        if (decoded && typeof decoded !== 'string') {
            let { uuid } = decoded;
            if (
                decoded !== undefined &&
                decoded.iat !== undefined &&
                Date.now() / 1000 - decoded.iat > 60 * 60 * 24
            ) {
                let freshToken = await JsonWebToken.generateToken({
                    uuid,
                });
                ctx.cookies.set('access_token', freshToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
                    httpOnly: true,
                });
            }
            let user = await UserAPIRouter.getUserByUUID(ctx, uuid);
            ctx.loginedUser = user;
        } else {
            ctx.loginedUser = null;
        }
    } catch (e) {
        ctx.loginedUser = null;
    }

    return next(ctx);
}

export default UserMiddleWare;
