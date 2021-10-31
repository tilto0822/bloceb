import { PrismaClient, User } from '@prisma/client';

import 'dotenv/config';
import Router from '../lib/Router';
import Logger from '../lib/Logger';

export class ProjectAPIRouter extends Router {
    constructor() {
        super();
    }

    static async createProject(name, uuid) {
        // TODO :: 기능 구현
    }

    static async getProjectByUUID(uuid) {
        let prisma = new PrismaClient();
        let project = await prisma.project.findFirst({
            where: {
                uuid: uuid,
            },
        });
        if (project === null) {
            prisma.$disconnect();
            throw new Error('BLE:PROJECT_NOT_FOUND');
        }
        return project;
    }

    static async getUserProjectsByUUID(uuid) {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                uuid: uuid,
            },
            include: {
                projects: true,
            },
        });
        if (user === null) {
            prisma.$disconnect();
            throw new Error('BLE:USER_NOT_FOUND');
        }
        return user.projects;
    }

    static async getUserProjectsByLoginId(loginId) {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                loginId: loginId,
            },
            include: {
                projects: true,
            },
        });
        if (user === null) {
            prisma.$disconnect();
            throw new Error('BLE:USER_NOT_FOUND');
        }
        return user.projects;
    }

    static async getUserProjectsByName(nickname) {
        let prisma = new PrismaClient();
        let user = await prisma.user.findFirst({
            where: {
                nickname: nickname,
            },
            include: {
                projects: true,
            },
        });
        if (user === null) {
            prisma.$disconnect();
            throw new Error('BLE:USER_NOT_FOUND');
        }
        return user.projects;
    }
}

export default ProjectAPIRouter;
