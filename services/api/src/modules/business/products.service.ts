import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(user: any, createProductDto: CreateProductDto) {
    // ⚠️ SEGURIDAD CRÍTICA: Usamos el tenantId del TOKEN, no del body
    // Esto evita que un usuario malintencionado envíe un tenantId falso en el JSON
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        categoryId: createProductDto.categoryId,
        tenantId: user.tenantId, // <--- ASIGNACIÓN AUTOMÁTICA Y SEGURA
      },
    });
  }

  async findAll(user: any) {
    // El usuario solo verá productos de SU tenant
    return this.prisma.product.findMany({
      where: { tenantId: user.tenantId },
    });
  }
}