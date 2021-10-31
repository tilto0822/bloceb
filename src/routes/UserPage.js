import Router from '../lib/Router';
import UserAPIRouter from './UserAPI';

import Lang from '../lib/Lang';
import Logger from '../lib/Logger';

class UserPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/:nickname', async (ctx, next) => {
            let { nickname } = ctx.params;
            let renderRes;

            try {
                let user = await UserAPIRouter.getUserByName(nickname);

                renderRes = this.renderLayout(ctx, ['user.ejs'], {
                    stylesheets: ['user'],
                    javascripts: ['user'],
                    data: {
                        errMessage: null,
                        nickname: nickname,
                        userData: user,
                    },
                });
            } catch (err) {
                let message = err.message;
                if (message && message.startsWith('BLE:')) {
                    renderRes = this.renderLayout(ctx, ['user.ejs'], {
                        stylesheets: ['user'],
                        javascripts: ['user'],
                        data: {
                            errMessage: message
                                ? await Lang.getLangByCode('ko_kr', message)
                                : null,
                            nickname: nickname,
                            userData: null,
                        },
                    });
                } else {
                    Logger.error(err);
                }
            }

            ctx.status = 200;
            ctx.type = 'text/html; charset=utf-8';
            ctx.body = renderRes;
        });
    }
}

export default UserPageRouter;
