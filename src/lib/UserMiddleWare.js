import { Prisma, PrismaClient, User } from '.prisma/client';
import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';
import UserAPIRouter from '../routes/UserAPI';

import JsonWebToken from './JsonWebToken';

export async function UserMiddleWare(ctx, next) {
    let token = ctx.cookies.get('access_token');
    if (typeof token !== 'string') return next(ctx);

    try {
        let decoded = await JsonWebToken.decodeToken(token);
        if (decoded) {
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
            let user = UserAPIRouter.getUserByUUID(uuid);
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
