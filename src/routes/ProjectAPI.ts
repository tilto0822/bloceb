import 'dotenv/config';
import { Context } from 'koa';
import Logger from '../lib/Logger';
import Router from '../lib/Router';

export class ProjectAPIRouter extends Router {
    constructor() {
        super();

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
