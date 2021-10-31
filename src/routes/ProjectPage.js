import Router from '../lib/Router';

class ProjectPageRouter extends Router {
    constructor() {
        super();

        this._router.get('/', async (ctx, next) => {
            let renderRes = this.renderLayout(ctx, ['project.ejs'], {});

            ctx.status = 200;
            ctx.type = 'text/html; charset=utf-8';
            ctx.body = renderRes;
        });

        this._router.get('/:nickname', async (ctx, next) => {
            let { nickname } = ctx.params;
            let renderRes;

            try {
                let user = await UserAPIRouter.getUserByName(nickname);

                renderRes = this.renderLayout(ctx, ['project_mine.ejs'], {
                    data: {
                        errMessage: null,
                        nickname: nickname,
                        userData: user,
                    },
                });
            } catch (err) {
                let message = err.message;
                if (message && message.startsWith('BLE:')) {
                    renderRes = this.renderLayout(ctx, ['project_mine.ejs'], {
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

export default ProjectPageRouter;
