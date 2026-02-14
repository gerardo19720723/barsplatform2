import { PrismaService } from '../../prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
export declare class IngredientsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(user: any, createIngredientDto: CreateIngredientDto): import(".prisma/client").Prisma.Prisma__IngredientClient<{
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
    updateStock(id: string, quantityToSubtract: number): import(".prisma/client").Prisma.Prisma__IngredientClient<{
        id: string;
        tenantId: string;
        name: string;
        unit: string;
        stock: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
