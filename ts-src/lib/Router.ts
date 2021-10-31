import * as fs from 'fs';
import * as p from 'path';
import * as Koa from 'koa';
import { ejs } from 'koa-ejs';
import * as KoaRouter from 'koa-router';
import { User } from '@prisma/client';

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
    userData: User | null;
}

export class Router {
    protected _router: KoaRouter;
    protected _pathEJSMap: Map<string, string>;

    constructor() {
        this._router = new KoaRouter();
        this._pathEJSMap = new Map();
    }

    protected getGlobalData(
        ctx: Koa.ParameterizedContext<any, any, any>
    ): globalData {
        let logined = ctx.loginedUser ? true : false;
        return {
            isLogin: logined,
            userData: ctx.loginedUser,
        };
    }

    protected renderLayout(
        ctx: Koa.ParameterizedContext<any, any, any>,
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

        let gd = this.getGlobalData(ctx);

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
    }

    get router() {
        return this._router;
    }
}
export default Router;
