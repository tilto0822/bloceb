import 'dotenv/config';
import { Context } from 'koa';
import Logger from '../lib/Logger';
import Router from '../lib/Router';

export class ProjectAPIRouter extends Router {
    constructor() {
        super();

        this._router.post('/save', async (ctx) => {
            let { puuid, title, xmlCode, viewCode } = ctx.request.body;
            try {
                let project = await ProjectAPIRouter.saveProject(
                    ctx,
                    puuid,
                    title,
                    xmlCode,
                    viewCode
                );
                if (project)
                    ctx.body = {
                        type: 'Success',
                        message: `"${title}" 프로젝트를 저장했습니다.`,
                    };
                else
                    ctx.body = {
                        type: 'Error',
                        message: `"${title}" 프로젝트 저장에 실패했습니다. 문제가 지속될 경우 문의바랍니다.`,
                    };
            } catch (err: any) {
                ctx.body = {
                    type: 'Error',
                    message: `"${title}" 프로젝트 저장에 실패했습니다. 문제가 지속될 경우 문의바랍니다.`,
                };
                Logger.error(err);
            }
        });

        this._router.post('/load', async (ctx) => {
            let { puuid } = ctx.request.body;
            try {
                let project = await ProjectAPIRouter.getProjectByUUID(
                    ctx,
                    puuid
                );
                if (project)
                    ctx.body = {
                        type: 'Success',
                        project: project,
                    };
                else
                    ctx.body = {
                        type: 'Error',
                        message: `프로젝트를 불러오지 못했습니다.`,
                    };
            } catch (err: any) {
                ctx.body = {
                    type: 'Error',
                    message: `프로젝트를 불러오지 못했습니다.`,
                };
                Logger.error(err);
            }
        });

        this._router.get('/create', async (ctx) => {
            if (ctx.loginedUser) {
                let { title } = ctx.query;
                if (!title) {
                    ctx.redirect(
                        `/project/${ctx.loginedUser.nickname}?message=BLE:EMPTY_PROJECT_TITLE`
                    );
                    return;
                }
                try {
                    let project = await ProjectAPIRouter.createProject(
                        ctx,
                        Array.isArray(title) ? title.join(' ') : title,
                        ctx.loginedUser.uuid
                    );
                } catch (err: any) {
                    if (err.message && err.message.startsWith('BLE:')) {
                        ctx.redirect(
                            `/project/${ctx.loginedUser.nickname}?message=${err.message}`
                        );
                    } else {
                        Logger.error(err);
                    }
                }
                ctx.redirect(`/project/${ctx.loginedUser.nickname}`);
            } else ctx.redirect(`/project`);
        });
    }

    static async createProject(
        ctx: Context,
        projectName: string,
        userUUID: string
    ) {
        let project = await ctx.prisma.project.create({
            data: {
                title: projectName,
                xmlCode: '',
                viewCode: '',
                author: {
                    connect: {
                        uuid: userUUID,
                    },
                },
            },
        });
        if (project === null) {
            throw new Error('BLE:PROJECT_NOT_FOUND');
        }
        return project;
    }

    static async saveProject(
        ctx: Context,
        projectUUID: string,
        title: string,
        xmlCode: string,
        viewCode: string
    ) {
        let project = await ctx.prisma.project.update({
            where: {
                uuid: projectUUID,
            },
            data: {
                title: title,
                xmlCode: xmlCode,
                viewCode: viewCode,
            },
        });
        return project;
    }

    static async getProjectByUUID(ctx: Context, uuid: string) {
        let project = await ctx.prisma.project.findFirst({
            where: {
                uuid: uuid,
            },
        });
        if (project === null) {
            throw new Error('BLE:PROJECT_NOT_FOUND');
        }
        return project;
    }

    static async getUserProjectsByUUID(ctx: Context, uuid: string) {
        let user = await ctx.prisma.user.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                projects: true,
            },
        });
        if (user === null) {
            throw new Error('BLE:USER_NOT_FOUND');
        }
        return user.projects;
    }

    static async getUserProjectsByLoginId(ctx: Context, loginId: string) {
        let user = await ctx.prisma.user.findFirst({
            where: {
                loginId: loginId,
            },
            include: {
                projects: true,
            },
        });
        if (user === null) {
            throw new Error('BLE:USER_NOT_FOUND');
        }
        return user.projects;
    }

    static async getUserProjectsByName(ctx: Context, nickname: string) {
        let user = await ctx.prisma.user.findFirst({
            where: {
                nickname: nickname,
            },
            include: {
                projects: true,
            },
        });
        if (user === null) {
            throw new Error('BLE:USER_NOT_FOUND');
        }
        return user.projects;
    }
}

export default ProjectAPIRouter;
