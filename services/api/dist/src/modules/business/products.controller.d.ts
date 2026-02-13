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
    findAll(user: any): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        name: string;
        price: number;
        categoryId: string | null;
    }[]>;
}
