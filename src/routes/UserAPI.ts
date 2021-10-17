import { PrismaClient } from '.prisma/client';
import * as express from 'express';
import Router from '../lib/Router';

class UserAPIRouter extends Router {
    constructor() {
        super();

        this._router.post('/register', async (req, res) => {
            let prisma = new PrismaClient();
            let checkId = await prisma.user.findFirst({
                where: {
                    loginId: req.body.loginId,
                },
            });
            if (checkId !== null) {
                res.send({
                    status: 'Error',
                    message: '이미 사용중인 ID입니다!',
                });
                prisma.$disconnect();
                return;
            }
            let checkNick = await prisma.user.findFirst({
                where: {
                    nickname: req.body.nickname,
                },
            });
            if (checkNick !== null) {
                res.send({
                    status: 'Error',
                    message: '이미 사용중인 닉네임입니다!',
                });
                prisma.$disconnect();
                return;
            }
            let emailPattern = new RegExp(
                /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]+$/
            );
            if (!emailPattern.test(req.body.email)) {
                res.send({
                    status: 'Error',
                    message: '올바르지 않은 이메일 형식입니다!',
                });
                prisma.$disconnect();
                return;
            }
            let checkMail = await prisma.user.findFirst({
                where: {
                    email: req.body.email,
                },
            });
            if (checkMail !== null) {
                res.send({
                    status: 'Error',
                    message: '이미 사용중인 이메일입니다!',
                });
                prisma.$disconnect();
                return;
            }
            let checkPw = await prisma.user.findFirst({
                where: {
                    password: req.body.password,
                },
            });
            if (checkMail !== null) {
                res.send({
                    status: 'Error',
                    message: `그 비밀번호는 ${checkPw?.loginId}님이 사용중입니다!`,
                });
                prisma.$disconnect();
                return;
            }
            let newUser = await prisma.user.create({
                data: {
                    loginId: req.body.loginId,
                    nickname: req.body.nickname,
                    password: req.body.password,
                    pwsalt: req.body.pwsalt,
                    email: req.body.email,
                },
            });
            res.send({
                status: 'Success',
                message: `회원가입에 성공했습니다!`,
            });
            prisma.$disconnect();
            return;
        });
    }
}

export default UserAPIRouter;
