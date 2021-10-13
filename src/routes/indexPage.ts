import * as express from 'express';
import Router from '../lib/Router';

class IndexPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', (req, res, next) => {
            res.render('index', {
                isLogin: true,
            });
        });
    }
}

export default IndexPageRouter;
