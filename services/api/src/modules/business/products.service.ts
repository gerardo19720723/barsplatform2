import { Injectable, BadRequestException } from '@nestjs/common';
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
    return this.prisma.product.findMany({
      where: { tenantId: user.tenantId },
      include: { 
        category: true,
        // ✅ AGREGAR ESTO PARA TRAER LA RECETA
        ingredients: {
          include: {
            ingredient: true
          }
        }
      },
    });
  }
    // Agregar un ingrediente a la receta de un producto
  async addIngredientToRecipe(data: { productId: string; ingredientId: string; quantity: number }) {
    // Usamos 'create' para crear la relación en la tabla ProductIngredient
    // Si intentas agregar el mismo ingrediente dos veces al mismo producto, Prisma dará error (Unique Constraint)
    return this.prisma.productIngredient.create({
      data: {
        productId: data.productId,
        ingredientId: data.ingredientId,
        quantity: data.quantity,
      },
      include: {
        ingredient: true // Devolvemos los datos del ingrediente para confirmar
      }
    });
  }

    // Eliminar un ingrediente de la receta
  async removeIngredientFromRecipe(productId: string, ingredientId: string) {
    // Borramos la relación en la tabla ProductIngredient
    return this.prisma.productIngredient.deleteMany({
      where: {
        productId: productId,
        ingredientId: ingredientId,
      },
    });
  }
    async sellProduct(productId: string) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: {
          ingredients: { include: { ingredient: true } }
        }
      });

      if (!product) throw new Error('Producto no encontrado');

      // --- NUEVO: Calcular Costo de la Orden ---
      let orderCost = 0;

      for (const item of product.ingredients) {
        const currentIngredient = await tx.ingredient.findUnique({
          where: { id: item.ingredientId }
        });

        if (!currentIngredient) continue;

        // Acumulamos el costo: (Cantidad usada en receta * Costo unitario del ingrediente)
        orderCost += (item.quantity * currentIngredient.cost);

        // Lógica de Stock (sigue igual)
        const newStock = currentIngredient.stock - item.quantity;
        if (newStock < 0) {
          throw new BadRequestException(
            `Stock insuficiente para: ${currentIngredient.name}. (Quedan ${currentIngredient.stock})`
          );
        }

        await tx.ingredient.update({
          where: { id: item.ingredientId },
          data: { stock: newStock }
        });
      }

      // Crear la orden guardando EL COSTO calculado
      const order = await tx.order.create({
        data: {
          total: product.price,
          totalCost: orderCost, // <--- GUARDAMOS EL COSTO
          tenantId: product.tenantId,
          items: {
            create: {
              productId: product.id,
              quantity: 1,
              price: product.price
            }
          }
        }
      });

      return { 
        message: 'Venta registrada exitosamente', 
        orderId: order.id 
      };
    });
  }
}