import { PrismaService } from '../../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: any): import(".prisma/client").Prisma.PrismaPromise<({
        items: ({
            product: {
                id: string;
                tenantId: string;
                createdAt: Date;
                name: string;
                price: number;
                categoryId: string | null;
            };
        } & {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
        })[];
    } & {
        id: string;
        total: number;
        totalCost: number;
        tenantId: string;
        createdAt: Date;
    })[]>;
    getStats(user: any, startDate?: string, endDate?: string): Promise<{
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        totalOrders: number;
    }>;
}
