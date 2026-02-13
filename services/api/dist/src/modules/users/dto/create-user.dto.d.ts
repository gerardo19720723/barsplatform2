export declare enum UserRole {
    PLATFORM_ADMIN = "PLATFORM_ADMIN",
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    STAFF = "STAFF"
}
export declare class CreateUserDto {
    email: string;
    password: string;
    role: UserRole;
    tenantId: string;
}
