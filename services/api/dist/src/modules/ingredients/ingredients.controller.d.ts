import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
export declare class IngredientsController {
    private readonly ingredientsService;
    constructor(ingredientsService: IngredientsService);
    create(createIngredientDto: CreateIngredientDto, user: any): import(".prisma/client").Prisma.Prisma__IngredientClient<{
        id: string;
        name: string;
        unit: string;
        stock: number;
        cost: number;
        tenantId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(user: any): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        unit: string;
        stock: number;
        cost: number;
        tenantId: string;
    }[]>;
}
