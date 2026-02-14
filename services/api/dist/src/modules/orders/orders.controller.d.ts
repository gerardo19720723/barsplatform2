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
            price: number;
            quantity: number;
            productId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        total: number;
    })[]>;
}
