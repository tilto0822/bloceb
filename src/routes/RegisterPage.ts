import Lang from '../lib/Lang';
import Logger from '../lib/Logger';
import Router from '../lib/Router';

class RegisterPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', async (ctx, next) => {
            let { id, nickname, email, message } = ctx.query;

            let msg: string | null =
                message !== null && typeof message === 'string'
                    ? message
                    : null;

            let renderRes = this.renderLayout(ctx, ['register.ejs'], {
                stylesheets: ['register'],
                javascripts: ['register'],
                data: {
                    previousId: id ? id : null,
                    previousNickname: nickname ? nickname : null,
                    previousEmail: email ? email : null,
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

export default RegisterPageRouter;
