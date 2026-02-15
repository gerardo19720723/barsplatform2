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
        ingredients: ({
            ingredient: {
                id: string;
                name: string;
                tenantId: string;
                unit: string;
                stock: number;
                cost: number;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        name: string;
        price: number;
        createdAt: Date;
        categoryId: string | null;
        tenantId: string;
    })[]>;
    addIngredientToRecipe(data: {
        productId: string;
        ingredientId: string;
        quantity: number;
    }): Promise<{
        ingredient: {
            id: string;
            name: string;
            tenantId: string;
            unit: string;
            stock: number;
            cost: number;
        };
    } & {
        id: string;
        productId: string;
        ingredientId: string;
        quantity: number;
    }>;
    removeIngredientFromRecipe(productId: string, ingredientId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    sellProduct(productId: string): Promise<{
        message: string;
        orderId: string;
    }>;
}
