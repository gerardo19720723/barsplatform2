import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        tenantId: string | null;
        createdAt: Date;
    }>;
}
