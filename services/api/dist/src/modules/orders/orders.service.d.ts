import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
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
        tableNumber: string;
        status: string;
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
    createOrder(user: any, createOrderDto: CreateOrderDto): Promise<{
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
        status: string;
        total: number;
        totalCost: number;
        tenantId: string;
        createdAt: Date;
    }>;
    updateStatus(orderId: string, status: string): import(".prisma/client").Prisma.Prisma__OrderClient<{
        id: string;
        tableNumber: string;
        status: string;
        total: number;
        totalCost: number;
        tenantId: string;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
