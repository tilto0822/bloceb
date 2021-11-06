import * as fs from 'fs';
import * as p from 'path';
import { ejs } from 'koa-ejs';
import Router from '../lib/Router';
import ProjectAPIRouter from './ProjectAPI';

class EditPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', async (ctx, next) => {
            let { puuid } = ctx.query;
            if (puuid && typeof puuid === 'string') {
                let layout = fs.readFileSync(
                    p.join(__dirname, '..', '..', 'views', 'edit.ejs'),
                    'utf-8'
                );

                let project = await ProjectAPIRouter.getProjectByUUID(
                    ctx,
                    puuid
                );

                let gd = Router.getGlobalData(ctx);

                let renderRes = ejs.render(layout, {
                    title: `${project.title} - bloceb`,
                    isAuthor:
                        ctx.loginedUser &&
                        ctx.loginedUser.uuid === project.authorId
                            ? true
                            : false,
                    ...gd,
                });

                ctx.status = 200;
                ctx.type = 'text/html; charset=utf-8';
                ctx.body = renderRes;
            } else ctx.redirect('/project');
        });
    }
}

export default EditPageRouter;
