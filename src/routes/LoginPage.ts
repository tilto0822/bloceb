import Lang from '../lib/Lang';
import Router from '../lib/Router';

class LoginPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', async (ctx, next) => {
            let { id, message } = ctx.query;

            let msg: string | null =
                message !== null && typeof message === 'string'
                    ? message
                    : null;

            let renderRes = this.renderLayout(ctx, ['login.ejs'], {
                stylesheets: ['login'],
                javascripts: ['login'],
                data: {
                    previousId: id ? id : null,
                    errMessage: msg
                        ? await Lang.getLangByCode('ko_kr', msg)
                        : null,
                },
            }); // string

            ctx.status = 200;
            ctx.type = 'text/html; charset=utf-8';
            ctx.body = renderRes;
        });
    }
}

export default LoginPageRouter;
