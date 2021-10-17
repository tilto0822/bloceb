import * as express from 'express';
import Router from '../lib/Router';

class LoginPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', (req, res, next) => {
            let renderRes = this.renderLayout(['login.ejs'], {
                stylesheets: ['login'],
                javascripts: ['login'],
            }); // string

            res.writeHead(200, { 'Content-type': 'text/html' });
            res.write(renderRes);
            res.end();
        });
    }
}

export default LoginPageRouter;
