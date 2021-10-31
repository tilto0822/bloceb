import { PrismaClient, User } from '@prisma/client';

import 'dotenv/config';
import Router from '../lib/Router';
import Logger from '../lib/Logger';
import UserCrypto from '../lib/UserCrypto';
import JsonWebToken from '../lib/JsonWebToken';

// export interface UserData {
//     uuid: string;
//     loginId: string;
//     nickname: string;
//     email: string;
// }

export class UserAPIRouter extends Router {
    constructor() {
        super();

        this._router.post('/get/id', async (ctx, next) => {
            try {
                let user = await UserAPIRouter.getUserByID(
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
            } catch (err) {
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
            } catch (err) {
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
                    body.loginId,
                    body.password
                );
                ctx.cookies.set('access_token', jwt, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                });
                // ctx.status = 307;
                ctx.redirect('/');
                // ctx.body = {
                //     type: 'Success',
                //     message: '로그인에 성공하였습니다.',
                // };
            } catch (err) {
                if (err.message && err.message.startsWith('BLE:')) {
                    // ctx.body = {
                    //     type: 'Error',
                    //     message: err.message.split('BLE:')[1],
                    // };
                    // ctx.status = 307;
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
            try {
                let body = ctx.request.body;
                let user = await UserAPIRouter.registerUser(body);
                if (user) ctx.redirect('/');
                else
                    ctx.redirect(
                        `/register?id=${body.loginId}&message=BLE:NONE`
                    );
            } catch (err) {
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

    static async loginUser(id, password) {
        let prisma = new PrismaClient();
        let getUser = await prisma.user.findFirst({
            where: {
                loginId: id,
            },
        });
        if (getUser === null) {
            prisma.$disconnect();
            throw new Error('BLE:IDPW_IS_NOT_CORRECT');
        }
        let hashedPW = await UserCrypto.makePasswordHashed(
            password,
            getUser.pwsalt
        );
        if (hashedPW !== getUser.password) {
            prisma.$disconnect();
            throw new Error('BLE:IDPW_IS_NOT_CORRECT');
        }
        prisma.$disconnect();
        return JsonWebToken.generateToken({
            uuid: getUser.uuid,
        });
    }

    static async registerUser(data) {
        let prisma = new PrismaClient();
        let checkId = await prisma.user.findFirst({
            where: {
                loginId: data.loginId,
            },
        });
        if (checkId !== null) {
            prisma.$disconnect();
            throw new Error('BLE:ALREADY_USING_ID');
        }
        let checkNick = await prisma.user.findFirst({
            where: {
                nickname: data.nickname,
            },
        });
        if (checkNick !== null) {
            prisma.$disconnect();
            throw new Error('BLE:ALREADY_USING_NICKNAME');
        }
        let emailPattern = new RegExp(
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/
        );
        if (!emailPattern.test(data.email)) {
            prisma.$disconnect();
            throw new Error('BLE:EMAIL_REGEXP_FAILED');
        }
        let checkMail = await prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });
        if (checkMail !== null) {
            prisma.$disconnect();
            throw new Error('BLE:ALREADY_USING_EMAIL');
        }
        let salt = await UserCrypto.createRandomSalt();
        let hashedPW = await UserCrypto.makePasswordHashed(data.password, salt);
        let newUser = await prisma.user.create({
            data: {
                loginId: data.loginId,
                nickname: data.nickname,
                password: hashedPW,
                pwsalt: salt,
                email: data.email,
            },
        });
        prisma.$disconnect();
        return newUser;
    }

    static async getUserByUUID(uuid) {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                uuid: uuid,
            },
        });
        if (user === null) {
            prisma.$disconnect();
            throw new Error('BLE:USER_NOT_FOUND');
        } else return user;
    }

    static async getUserByLoginID(loginId) {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                loginId: loginId,
            },
        });
        if (user === null) {
            prisma.$disconnect();
            throw new Error('BLE:USER_NOT_FOUND');
        } else return user;
    }

    static async getUserByName(nickname) {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                nickname: nickname,
            },
        });
        if (user === null) {
            prisma.$disconnect();
            throw new Error('BLE:USER_NOT_FOUND');
        } else return user;
    }
}

export default UserAPIRouter;
