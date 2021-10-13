import * as express from 'express';
import Router from '../lib/Router';

class LoginPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', (req, res, next) => {
            res.render('login', {
                isLogin: false,
            });
        });
    }
}

export default LoginPageRouter;
