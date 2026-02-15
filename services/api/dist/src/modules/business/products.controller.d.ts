import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, user: any): Promise<{
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
    addIngredient(productId: string, body: {
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
    removeIngredientFromRecipe(body: {
        productId: string;
        ingredientId: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    sellProduct(productId: string): Promise<{
        message: string;
        orderId: string;
    }>;
}
