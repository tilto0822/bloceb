import * as path from 'path';
import * as Koa from 'koa';
import * as KoaEjs from 'koa-ejs';
import * as Router from 'koa-router';
import * as KoaBodyParser from 'koa-bodyparser';
import * as KoaServe from 'koa-static';
import { PrismaClient } from '@prisma/client';

import 'dotenv/config';

import Logger from './lib/Logger';
import UserMiddleWare from './lib/UserMiddleWare';

import IndexPageRouter from './routes/IndexPage';
import LoginPageRouter from './routes/LoginPage';

import UserAPIRouter from './routes/UserAPI';

class MainServer {
    public app: Koa;
    public router: Router;

    constructor() {
        this.app = new Koa();
        this.router = new Router();

        KoaEjs(this.app, {
            root: path.join(__dirname, '..', 'views'),
            layout: false,
            viewExt: 'ejs',
            cache: false,
            debug: true,
        });

        this.app.use(KoaServe(path.join(__dirname, '..', 'views', 'public')));
        this.app.use(KoaBodyParser());
        this.app.use(UserMiddleWare);

        this.router.use('/', new IndexPageRouter().router.routes());
        this.router.use('/login', new LoginPageRouter().router.routes());

        this.router.use('/api/users', new UserAPIRouter().router.routes());

        this.app.use(this.router.routes()).use(this.router.allowedMethods());

        this.app.listen(process.env.PORT || 80, () => {
            Logger.info(`Server is open on localhost:80`);
        });
    }
}

let app = new MainServer();

// let test = async () => {
//     let prisma = new PrismaClient();
//     let res = await prisma.user.findFirst({
//         where: {
//             loginId: 'tilto0822',
//         },
//     });
//     Logger.info(res);
// };
// test();
