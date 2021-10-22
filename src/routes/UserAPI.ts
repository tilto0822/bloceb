import { PrismaClient, User } from '.prisma/client';
import * as jwt from 'jsonwebtoken';

import 'dotenv/config';
import Router from '../lib/Router';
import Logger from '../lib/Logger';
import UserCrypto from '../lib/UserCrypto';
import JsonWebToken from '../lib/JsonWebToken';

export interface UserData {
    uuid: string;
    loginId: string;
    nickname: string;
    email: string;
}

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
            } catch (err: any) {
                if (err.message && err.message.startsWith('BLE::')) {
                    ctx.body = {
                        type: 'Error',
                        message: err.message.split('BLE::')[1],
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
            } catch (err: any) {
                if (err.message && err.message.startsWith('BLE::')) {
                    ctx.body = {
                        type: 'Error',
                        message: err.message.split('BLE::')[1],
                    };
                } else {
                    Logger.error(err);
                }
            }
        });

        this._router.post('/login', async (ctx, next) => {
            try {
                let body: {
                    logindId: string;
                    password: string;
                } = ctx.request.body;
                let jwt = await UserAPIRouter.loginUser(
                    body.logindId,
                    body.password
                );
                ctx.cookies.set('access_token', jwt, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                });
                ctx.body = {
                    type: 'Success',
                    message: '로그인에 성공하였습니다.',
                };
            } catch (err: any) {
                if (err.message && err.message.startsWith('BLE::')) {
                    ctx.body = {
                        type: 'Error',
                        message: err.message.split('BLE::')[1],
                    };
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

        this._router.post('/register', async (ctx, next) => {
            try {
                let body: {
                    loginId: string;
                    nickname: string;
                    password: string;
                    email: string;
                } = ctx.request.body;
                let user = await UserAPIRouter.registerUser(body);
                if (user)
                    ctx.body = {
                        type: 'Success',
                        message: '회원가입에 성공했습니다!',
                    };
                else
                    ctx.body = {
                        type: 'Error',
                        message:
                            '알 수 없는 이유로 회원가입에 실패했습니다. 문제가 지속될 시 관리자에게 연락바랍니다.',
                    };
            } catch (err: any) {
                if (err.message && err.message.startsWith('BLE::')) {
                    ctx.body = {
                        type: 'Error',
                        message: err.message.split('BLE::')[1],
                    };
                } else {
                    Logger.error(err);
                }
            }
        });
    }

    public static async loginUser(id: string, password: string) {
        let prisma = new PrismaClient();
        let getUser = await prisma.user.findFirst({
            where: {
                loginId: id,
            },
        });
        if (getUser === null) {
            prisma.$disconnect();
            throw new Error('BLE::ID또는 비밀번호가 올바르지 않습니다!');
        }
        let hashedPW = await UserCrypto.makePasswordHashed(
            password,
            getUser.pwsalt
        );
        if (hashedPW !== getUser.password) {
            prisma.$disconnect();
            throw new Error('BLE::ID또는 비밀번호가 올바르지 않습니다!');
        }
        prisma.$disconnect();
        return JsonWebToken.generateToken({
            _uuid: getUser.uuid,
            user: getUser,
        });
    }

    public static async registerUser(data: {
        loginId: string;
        nickname: string;
        password: string;
        email: string;
    }): Promise<User> {
        let prisma = new PrismaClient();
        let checkId = await prisma.user.findFirst({
            where: {
                loginId: data.loginId,
            },
        });
        if (checkId !== null) {
            prisma.$disconnect();
            throw new Error('BLE::이미 사용중인 ID입니다!');
        }
        let checkNick = await prisma.user.findFirst({
            where: {
                nickname: data.nickname,
            },
        });
        if (checkNick !== null) {
            prisma.$disconnect();
            throw new Error('BLE::이미 사용중인 닉네임입니다!');
        }
        let emailPattern = new RegExp(
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/
        );
        if (!emailPattern.test(data.email)) {
            prisma.$disconnect();
            throw new Error('BLE::올바르지 않은 이메일 형식입니다!');
        }
        let checkMail = await prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });
        if (checkMail !== null) {
            prisma.$disconnect();
            throw new Error('BLE::이미 사용중인 이메일입니다!');
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

    public static async getUserByID(loginId: string): Promise<User> {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                loginId: loginId,
            },
        });
        if (user === null) {
            prisma.$disconnect();
            throw new Error('BLE::해당 사용자를 찾을 수 없습니다.');
        } else return user;
    }

    public static async getUserByName(nickname: string): Promise<User> {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                nickname: nickname,
            },
        });
        if (user === null) {
            prisma.$disconnect();
            throw new Error('BLE::해당 사용자를 찾을 수 없습니다.');
        } else return user;
    }
}

export default UserAPIRouter;
