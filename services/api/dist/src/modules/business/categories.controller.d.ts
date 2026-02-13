import { PrismaService } from '../../prisma/prisma.service';
export declare class CategoriesController {
    private prisma;
    constructor(prisma: PrismaService);
    create(body: {
        name: string;
        icon?: string;
    }, user: any): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        icon: string | null;
        createdAt: Date;
        tenantId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(user: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        icon: string | null;
        createdAt: Date;
        tenantId: string;
    }[]>;
}
