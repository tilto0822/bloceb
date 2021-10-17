import * as express from 'express';
import Router from '../lib/Router';

class IndexPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', (req, res, next) => {
            let renderRes = this.renderLayout(['index.ejs'], {});

            res.writeHead(200, { 'Content-type': 'text/html' });
            res.write(renderRes);
            res.end();
        });

        // this._router.get('/', (req, res, next) => {
        //     res.render('index', {
        //         isLogin: true,
        //     });
        // });
    }
}

export default IndexPageRouter;
