import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        subdomain: string;
        status: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        subdomain: string;
        status: string;
    }[]>;
}
