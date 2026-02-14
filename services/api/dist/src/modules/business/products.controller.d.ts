import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, user: any): Promise<{
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
    addIngredient(productId: string, body: {
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
    removeIngredientFromRecipe(body: {
        productId: string;
        ingredientId: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    sellProduct(productId: string): Promise<{
        message: string;
        product: string;
    }>;
}
