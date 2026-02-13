import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
export declare class TenantsService {
    private prisma;
    constructor(prisma: PrismaService);
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
