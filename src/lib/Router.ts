import * as express from 'express';

export class Router {
    protected _router: express.Router;

    constructor() {
        this._router = express.Router();
    }

    get router() {
        return this._router;
    }
}
export default Router;
