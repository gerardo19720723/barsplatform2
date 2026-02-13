import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../guards/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  create(@Body() body: { name: string; icon?: string }, @CurrentUser() user: any) {
    return this.prisma.category.create({
      data: {
        name: body.name,
        icon: body.icon || 'default',
        tenantId: user.tenantId, // Se asigna automáticamente al bar de Juan
      },
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: any) {
    return this.prisma.category.findMany({
      where: { tenantId: user.tenantId }, // Solo categorías de Juan
      orderBy: { name: 'asc' }
    });
  }
}
