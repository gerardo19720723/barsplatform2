import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
export declare class IngredientsController {
    private readonly ingredientsService;
    constructor(ingredientsService: IngredientsService);
    create(createIngredientDto: CreateIngredientDto, user: any): import(".prisma/client").Prisma.Prisma__IngredientClient<{
        id: string;
        tenantId: string;
        name: string;
        unit: string;
        stock: number;
        cost: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(user: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        tenantId: string;
        name: string;
        unit: string;
        stock: number;
        cost: number;
    }[]>;
}
