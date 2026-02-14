import { PrismaService } from '../../prisma/prisma.service';
export declare class IngredientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(user: any, data: {
        name: string;
        unit: string;
        stock: number;
    }): Promise<{
        id: string;
        name: string;
        unit: string;
        stock: number;
        tenantId: string;
    }>;
    findAll(user: any): Promise<{
        id: string;
        name: string;
        unit: string;
        stock: number;
        tenantId: string;
    }[]>;
}
