import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        tenantId: string | null;
        createdAt: Date;
    }>;
    create(data: {
        email: string;
        password: string;
        role: string;
        tenantId?: string;
    }): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        tenantId: string | null;
        createdAt: Date;
    }>;
}
