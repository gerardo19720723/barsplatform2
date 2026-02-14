import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// Asegúrate de que la ruta al DTO sea correcta según donde lo hayas puesto
import { CreateIngredientDto } from './dto/create-ingredient.dto'; 

@Injectable()
export class IngredientsService {
  constructor(private prisma: PrismaService) {}

  create(user: any, createIngredientDto: CreateIngredientDto) {
    return this.prisma.ingredient.create({
      data: {
        name: createIngredientDto.name,
        unit: createIngredientDto.unit,
        stock: createIngredientDto.stock,
        tenantId: user.tenantId,
      },
    });
  }

  findAll(user: any) {
    return this.prisma.ingredient.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { name: 'asc' },
    });
  }

  // Útil para el futuro cuando vendamos productos
  updateStock(id: string, quantityToSubtract: number) {
    return this.prisma.ingredient.update({
      where: { id },
      data: {
        stock: {
          decrement: quantityToSubtract,
        },
      },
    });
  }
}