import 'dotenv/config';
import Router from '../lib/Router';
import Logger from '../lib/Logger';
import UserCrypto from '../lib/UserCrypto';
import JsonWebToken from '../lib/JsonWebToken';
import { Context } from 'koa';

export interface UserData {
    uuid: string;
    loginId: string;
    nickname: string;
    password: string;
    email: string;
}

export class UserAPIRouter extends Router {
    constructor() {
        super();

        this._router.post('/get/loginid', async (ctx, next) => {
            try {
                let user = await UserAPIRouter.getUserByLoginID(
                    ctx,
                    ctx.request.body.loginId
                );
                ctx.body = {
                    type: 'Success',
                    data: {
                        uuid: user.uuid,
                        loginId: user.loginId,
                        nickname: user.nickname,
                        email: user.email,
                    },
                };
            } catch (err: any) {
                if (err.message && err.message.startsWith('BLE:')) {
                    ctx.body = {
                        type: 'Error',
                        message: err.message,
                    };
                } else {
                    Logger.error(err);
                }
            }
        });

        this._router.post('/get/name', async (ctx, next) => {
            try {
                let user = await UserAPIRouter.getUserByName(
                    ctx,
                    ctx.request.body.nickname
                );
                ctx.body = {
                    type: 'Success',
                    data: {
                        uuid: user.uuid,
                        loginId: user.loginId,
                        nickname: user.nickname,
                        email: user.email,
                    },
                };
            } catch (err: any) {
                if (err.message && err.message.startsWith('BLE:')) {
                    ctx.body = {
                        type: 'Error',
                        message: err.message,
                    };
                } else {
                    Logger.error(err);
                }
            }
        });

        this._router.post('/login', async (ctx, next) => {
            let body = ctx.request.body;
            try {
                let jwt = await UserAPIRouter.loginUser(
                    ctx,
                    body.loginId,
                    body.password
                );
                ctx.cookies.set('access_token', jwt, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                });
                ctx.redirect('/');
            } catch (err: any) {
                if (err.message && err.message.startsWith('BLE:')) {
                    ctx.redirect(
                        `/login?id=${body.loginId}&message=${err.message}`
                    );
                } else {
                    Logger.error(err);
                }
            }
        });

        this._router.post('/logout', async (ctx, next) => {
            ctx.cookies.set('access_token', null, {
                httpOnly: true,
                maxAge: 0,
            });
            ctx.body = {
                type: 'Success',
                message: '로그아웃 하였습니다.',
            };
        });

        this._router.get('/logout', async (ctx, next) => {
            ctx.cookies.set('access_token', null, {
                httpOnly: true,
                maxAge: 0,
            });
            ctx.redirect('/');
        });

        this._router.post('/register', async (ctx, next) => {
            let body = ctx.request.body;
            try {
                let user = await UserAPIRouter.registerUser(ctx, body);
                if (user) ctx.redirect('/');
                else
                    ctx.redirect(
                        `/register?id=${body.loginId}&message=BLE:NONE`
                    );
            } catch (err: any) {
                if (err.message && err.message.startsWith('BLE:')) {
                    ctx.redirect(
                        `/register?id=${body.loginId}&message=${err.message}`
                    );
                } else {
                    Logger.error(err);
                }
            }
        });
    }

    static async loginUser(ctx: Context, id: string, password: string) {
        let getUser = await ctx.prisma.user.findFirst({
            where: {
                loginId: id,
            },
        });
        if (getUser === null) {
            throw new Error('BLE:IDPW_IS_NOT_CORRECT');
        }
        let hashedPW = await UserCrypto.makePasswordHashed(
            password,
            getUser.pwsalt
        );
        if (hashedPW !== getUser.password) {
            throw new Error('BLE:IDPW_IS_NOT_CORRECT');
        }
        return JsonWebToken.generateToken({
            uuid: getUser.uuid,
        });
    }

    static async registerUser(ctx: Context, data: UserData) {
        let checkId = await ctx.prisma.user.findFirst({
            where: {
                loginId: data.loginId,
            },
        });
        if (checkId !== null) {
            throw new Error('BLE:ALREADY_USING_ID');
        }
        let checkNick = await ctx.prisma.user.findFirst({
            where: {
                nickname: data.nickname,
            },
        });
        if (checkNick !== null) {
            throw new Error('BLE:ALREADY_USING_NICKNAME');
        }
        let emailPattern = new RegExp(
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/
        );
        if (!emailPattern.test(data.email)) {
            throw new Error('BLE:EMAIL_REGEXP_FAILED');
        }
        let checkMail = await ctx.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });
        if (checkMail !== null) {
            throw new Error('BLE:ALREADY_USING_EMAIL');
        }
        let salt = await UserCrypto.createRandomSalt();
        let hashedPW = await UserCrypto.makePasswordHashed(data.password, salt);
        let newUser = await ctx.prisma.user.create({
            data: {
                loginId: data.loginId,
                nickname: data.nickname,
                password: hashedPW,
                pwsalt: salt,
                email: data.email,
            },
        });
        return newUser;
    }

    static async getUserByUUID(ctx: Context, uuid: string) {
        let user = await ctx.prisma.user.findFirst({
            where: {
                uuid: uuid,
            },
        });
        if (user === null) {
            throw new Error('BLE:USER_NOT_FOUND');
        } else return user;
    }

    static async getUserByLoginID(ctx: Context, loginId: string) {
        let user = await ctx.prisma.user.findFirst({
            where: {
                loginId: loginId,
            },
        });
        if (user === null) {
            throw new Error('BLE:USER_NOT_FOUND');
        } else return user;
    }

    static async getUserByName(ctx: Context, nickname: string) {
        let user = await ctx.prisma.user.findFirst({
            where: {
                nickname: nickname,
            },
        });
        if (user === null) {
            throw new Error('BLE:USER_NOT_FOUND');
        } else return user;
    }

    static async deleteUserByUUID(ctx: Context, uuid: string) {
        let user = await ctx.prisma.user.delete({
            where: {
                uuid: uuid,
            },
        });
        if (user === null) {
            throw new Error('BLE:USER_NOT_FOUND');
        }
        return true;
    }
}

export default UserAPIRouter;
