import Router from '../lib/Router';

class IndexPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', (ctx, next) => {
            let renderRes = this.renderLayout(ctx, ['index.ejs'], {});

            ctx.status = 200;
            ctx.type = 'text/html; charset=utf-8';
            ctx.body = renderRes;
        });

        // this._router.get('/', (req, res, next) => {
        //     res.render('index', {
        //         isLogin: true,
        //     });
        // });
    }
}

export default IndexPageRouter;
