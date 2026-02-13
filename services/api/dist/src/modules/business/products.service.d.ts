import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(user: any, createProductDto: CreateProductDto): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        name: string;
        price: number;
        categoryId: string | null;
    }>;
    findAll(user: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        name: string;
        price: number;
        categoryId: string | null;
    }[]>;
}
