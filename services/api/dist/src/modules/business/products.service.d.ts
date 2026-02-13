import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(user: any, createProductDto: CreateProductDto): Promise<{
        id: string;
        name: string;
        price: number;
        createdAt: Date;
        categoryId: string | null;
        tenantId: string;
    }>;
    findAll(user: any): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            tenantId: string;
            icon: string | null;
        };
    } & {
        id: string;
        name: string;
        price: number;
        createdAt: Date;
        categoryId: string | null;
        tenantId: string;
    })[]>;
}
