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
    findAll(user: any): Promise<({
        category: {
            id: string;
            tenantId: string;
            createdAt: Date;
            name: string;
            icon: string | null;
        };
        ingredients: ({
            ingredient: {
                id: string;
                tenantId: string;
                name: string;
                unit: string;
                stock: number;
            };
        } & {
            id: string;
            quantity: number;
            productId: string;
            ingredientId: string;
        })[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        name: string;
        price: number;
        categoryId: string | null;
    })[]>;
    addIngredientToRecipe(data: {
        productId: string;
        ingredientId: string;
        quantity: number;
    }): Promise<{
        ingredient: {
            id: string;
            tenantId: string;
            name: string;
            unit: string;
            stock: number;
        };
    } & {
        id: string;
        quantity: number;
        productId: string;
        ingredientId: string;
    }>;
    removeIngredientFromRecipe(productId: string, ingredientId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    sellProduct(productId: string): Promise<{
        message: string;
        product: string;
    }>;
}
