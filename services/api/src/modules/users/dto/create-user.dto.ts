import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export enum UserRole {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  tenantId: string; // Aquí es donde pegamos el ID del bar
}