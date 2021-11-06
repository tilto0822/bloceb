import * as path from 'path';
import * as Koa from 'koa';
import * as KoaEjs from 'koa-ejs';
import * as Router from 'koa-router';
import * as KoaBodyParser from 'koa-bodyparser';
import * as KoaServe from 'koa-static';

import 'dotenv/config';

import Logger from './lib/Logger';
import UserMiddleWare from './lib/UserMiddleWare';

import IndexPageRouter from './routes/IndexPage';
import LoginPageRouter from './routes/LoginPage';
import RegisterPageRouter from './routes/RegisterPage';
import UserPageRouter from './routes/UserPage';
import ProjectPageRouter from './routes/ProjectPage';

import UserAPIRouter from './routes/UserAPI';
import ProjectAPIRouter from './routes/ProjectAPI';
import DBMiddleware from './lib/DBMiddleWare';
import EditPageRouter from './routes/EditPage';
import ViewPageRouter from './routes/ViewPage';

class MainServer {
    private app: Koa;
    private router: Router;

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
        this.app.use(KoaServe(path.join(__dirname, '..', 'dist', 'public')));
        this.app.use(KoaBodyParser());
        this.app.use(DBMiddleware);
        this.app.use(UserMiddleWare);

        this.router.use('/', new IndexPageRouter().router.routes());
        this.router.use('/login', new LoginPageRouter().router.routes());
        this.router.use('/register', new RegisterPageRouter().router.routes());
        this.router.use('/user', new UserPageRouter().router.routes());
        this.router.use('/project', new ProjectPageRouter().router.routes());
        this.router.use('/edit', new EditPageRouter().router.routes());
        this.router.use('/view', new ViewPageRouter().router.routes());

        this.router.use('/api/users', new UserAPIRouter().router.routes());
        this.router.use(
            '/api/projects',
            new ProjectAPIRouter().router.routes()
        );

        this.app.use(this.router.routes()).use(this.router.allowedMethods());

        this.app.listen(process.env.PORT || 80, () => {
            Logger.info(`Server is open on localhost:80`);
        });
    }
}

let app = new MainServer();

// let test = async () => {
//     try {
//         let user = await ProjectAPIRouter.getUserProjectsByUUID(
//             '773d4c7a-28ad-4fc4-9427-ed839582ef99'
//         );
//         Logger.log(user);
//         let project = await ProjectAPIRouter.getProjectByUUID(
//             'b6550e3b-c0ad-4186-af9e-be888b7bd8b7'
//         );
//         Logger.log(project);
//     } catch (err) {
//         Logger.error(err);
//     }
// };
// test();
