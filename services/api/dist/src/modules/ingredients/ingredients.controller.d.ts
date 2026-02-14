import { IngredientsService } from './ingredients.service';
export declare class IngredientsController {
    private readonly ingredientsService;
    constructor(ingredientsService: IngredientsService);
    create(body: {
        name: string;
        unit: string;
        stock: number;
    }, user: any): Promise<{
        id: string;
        name: string;
        unit: string;
        stock: number;
        tenantId: string;
    }>;
    findAll(user: any): Promise<{
        id: string;
        name: string;
        unit: string;
        stock: number;
        tenantId: string;
    }[]>;
}
