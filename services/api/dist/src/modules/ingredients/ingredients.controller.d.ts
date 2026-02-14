import { IngredientsService } from './ingredients.service';
export declare class IngredientsController {
    private readonly ingredientsService;
    constructor(ingredientsService: IngredientsService);
    create(body: {
        name: string;
        unit: string;
        stock: number;
    }, user: any): import(".prisma/client").Prisma.Prisma__IngredientClient<{
        id: string;
        tenantId: string;
        name: string;
        unit: string;
        stock: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(user: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        tenantId: string;
        name: string;
        unit: string;
        stock: number;
    }[]>;
}
