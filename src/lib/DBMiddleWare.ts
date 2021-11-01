import { PrismaClient } from '.prisma/client';
import { Context } from 'koa';

const prisma = new PrismaClient();

declare module 'koa' {
    interface BaseContext {
        prisma: PrismaClient;
    }
}

export async function DBMiddleware(ctx: Context, next: any) {
    ctx.prisma = prisma;
    return next(ctx);
}

export default DBMiddleware;
