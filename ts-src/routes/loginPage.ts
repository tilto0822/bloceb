import Router from '../lib/Router';

class LoginPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', (ctx, next) => {
            let renderRes = this.renderLayout(['login.ejs'], {
                stylesheets: ['login'],
                javascripts: ['login'],
            }); // string

            ctx.status = 200;
            ctx.type = 'text/html; charset=utf-8';
            ctx.body = renderRes;
        });
    }
}

export default LoginPageRouter;
