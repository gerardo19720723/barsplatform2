import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
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
        tableNumber: string;
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
    create(createOrderDto: CreateOrderDto, user: any): Promise<{
        items: {
            id: string;
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
        }[];
    } & {
        id: string;
        tableNumber: string;
        total: number;
        totalCost: number;
        tenantId: string;
        createdAt: Date;
    }>;
}
