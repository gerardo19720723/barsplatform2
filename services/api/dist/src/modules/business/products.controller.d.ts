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
    } & {
        id: string;
        name: string;
        price: number;
        createdAt: Date;
        categoryId: string | null;
        tenantId: string;
    })[]>;
}
