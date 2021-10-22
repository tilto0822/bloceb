import * as jwt from 'jsonwebtoken';
import * as Koa from 'koa';

import JsonWebToken from './JsonWebToken';

declare module 'koa' {
    interface Context {
        loginedUser?: string;
    }
}

export async function UserMiddleWare(
    ctx: Koa.Context,
    next: (ctx: Koa.Context) => Promise<any>
) {
    let token = ctx.cookies.get('access_token');
    if (!token) return next(ctx); // 토큰이 없으면 바로 다음 작업을 진행합니다.

    try {
        let temp = await JsonWebToken.decodeToken(token);
        let decoded: jwt.JwtPayload;
        if (typeof temp !== 'string') {
            decoded = temp;
            let { _uuid, user } = decoded;
            if (
                decoded !== undefined &&
                decoded.iat !== undefined &&
                Date.now() / 1000 - decoded.iat > 60 * 60 * 24
            ) {
                // 토큰 만료일이 하루밖에 안남으면 토큰을 재발급합니다
                // 하루가 지나면 갱신해준다.
                let freshToken = await JsonWebToken.generateToken({
                    _uuid,
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
        ctx.loginedUser = undefined;
    }

    return next(ctx);
}

export default UserMiddleWare;
