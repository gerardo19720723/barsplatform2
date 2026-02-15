import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
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
