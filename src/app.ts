import * as express from 'express';
import * as path from 'path';
import * as createError from 'http-errors';
import * as cookieParser from 'cookie-parser';

import Logger from './lib/Logger';

import IndexPageRouter from './routes/IndexPage';
import LoginPageRouter from './routes/LoginPage';
import { PrismaClient } from '@prisma/client';

class MainServer {
    public app: express.Application;

    constructor() {
        this.app = express();

        this.app.set('port', process.env.PORT || 80);
        this.app.set('views', path.join(__dirname, '..', 'views'));
        this.app.set('view engine', 'ejs');

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(
            express.static(path.join(__dirname, '..', 'views', 'public'))
        );

        this.app.use(
            express.static(path.join(__dirname, 'public'), {
                maxAge: 31557600000,
            })
        );

        this.route();

        this.app.use((req, res, next) => {
            next(createError(404));
        });

        this.app.use((err: any, req: any, res: any, next: any) => {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });

        this.app.listen(process.env.PORT || 80, () => {
            Logger.info(`Server is open on localhost:80`);
        });
    }

    private route() {
        this.app.use('/', new IndexPageRouter().router);
        this.app.use('/login', new LoginPageRouter().router);
    }
}

// let app = new MainServer();

let test = async () => {
    let prisma = new PrismaClient();
    let res = await prisma.user.findFirst({
        where: {
            loginId: 'tilto0822',
        },
    });
    Logger.info(res);
};
test();
