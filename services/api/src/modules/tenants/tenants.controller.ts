import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Necesitamos crear este guard simple
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../guards/roles.decorator';

// Guard JWT genérico (para asegurar que esté logueado)
// Si no lo tienes, crea uno simple en auth folder: export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // 1. Requiere Token
  @Roles('PLATFORM_ADMIN') // 2. Requiere ser ADMIN DE PLATAFORMA
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.tenantsService.findAll();
  }
}