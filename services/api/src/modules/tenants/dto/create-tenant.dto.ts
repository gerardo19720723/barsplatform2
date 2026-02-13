import { IsString, IsOptional } from 'class-validator';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  subdomain: string; // Ejemplo: 'moe-bar' -> moe-bar.bars-platform.com
}