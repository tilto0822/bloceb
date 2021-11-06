import * as fs from 'fs';
import * as p from 'path';
import { ejs } from 'koa-ejs';
import * as KoaRouter from 'koa-router';
import Logger from './Logger';
import { Context } from 'koa';

// const layout = fs.readFileSync(
//     path.join(__dirname, '..', '..', 'views', 'layout.ejs'),
//     'utf-8'
// );

export interface renderGlobalData {
    isLogin: boolean;
    userData: renderGlobalDataUser | null;
}

export interface renderGlobalDataUser {
    uuid: string;
    loginId: string;
    nickname: string;
    email: string;
}

export interface renderLayoutOption {
    title?: string;
    stylesheets?: string[];
    javascripts?: string[];
    data?: Record<string, any>;
}

export class Router {
    _router;
    _pathEJSMap;

    constructor() {
        this._router = new KoaRouter();
        this._pathEJSMap = new Map();
    }

    public static getGlobalData(ctx: Context): renderGlobalData {
        if (ctx.loginedUser !== null)
            return {
                isLogin: true,
                userData: {
                    uuid: ctx.loginedUser.uuid,
                    loginId: ctx.loginedUser.loginId,
                    nickname: ctx.loginedUser.nickname,
                    email: ctx.loginedUser.email,
                },
            };
        else
            return {
                isLogin: false,
                userData: null,
            };
    }

    protected renderLayout(
        ctx: any,
        renderTarget: string[],
        options: renderLayoutOption = {}
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

        let gd = Router.getGlobalData(ctx);
        Logger.log(gd);

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
