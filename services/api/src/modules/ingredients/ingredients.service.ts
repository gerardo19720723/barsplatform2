import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo ingrediente
  async create(user: any, data: { name: string; unit: string; stock: number }) {
    return this.prisma.ingredient.create({
      data: {
        name: data.name,
        unit: data.unit, // Ej: 'kg', 'unidad', 'litro'
        stock: data.stock || 0,
        tenantId: user.tenantId, // Aislamiento por Tenant
      },
    });
  }

  // Listar todos los ingredientes del bar
  async findAll(user: any) {
    return this.prisma.ingredient.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { name: 'asc' },
    });
  }
}