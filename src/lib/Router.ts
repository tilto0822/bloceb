import * as express from 'express';
import * as fs from 'fs';
import * as p from 'path';
import * as ejs from 'ejs';

import Logger from './Logger';

// const layout = fs.readFileSync(
//     path.join(__dirname, '..', '..', 'views', 'layout.ejs'),
//     'utf-8'
// );

export interface layoutData {
    title?: string;
    data?: Object;
    stylesheets?: string[];
    javascripts?: string[];
}

export interface globalData {
    isLogin: boolean;
}

export class Router {
    protected _router: express.Router;
    protected _pathEJSMap: Map<string, string>;

    constructor() {
        this._router = express.Router();
        this._pathEJSMap = new Map();
    }

    protected getGlobalData(): globalData {
        return {
            isLogin: false,
        };
    }

    protected renderLayout(
        renderTarget: string[],
        options: layoutData = {}
    ): string {
        let layout = fs.readFileSync(
            p.join(__dirname, '..', '..', 'views', 'layout.ejs'),
            'utf-8'
        );
        let target = fs.readFileSync(
            p.join(__dirname, '..', '..', 'views', ...renderTarget),
            'utf-8'
        );

        let title = options.title
            ? options.title
            : 'bloceb - 블록으로 만드는 나만의 웹사이트';
        let css = options.stylesheets
            ? ['global', ...options.stylesheets]
            : ['global'];
        let js = options.javascripts
            ? ['global', ...options.javascripts]
            : ['global'];

        let gd = this.getGlobalData();

        let renderResult = ejs.render(layout, {
            title: title,
            content: ejs.render(target, {
                title: title,
                ...options.data,
                ...gd,
            }),
            css: css,
            js: js,
            ...options.data,
            ...gd,
        });

        return renderResult;

        // this._router.get(path, (req, res, next) => {

        //     res.writeHead(200, { 'Content-type': 'text/html' });
        //     res.write(renderResult);
        //     res.end();
        // });
    }

    get router() {
        return this._router;
    }
}
export default Router;
