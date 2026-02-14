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
    // Vender un producto (Restar stock de ingredientes)
  async sellProduct(productId: string) {
    // Usamos $transaction para asegurar que todo se ejecute correctamente
    return this.prisma.$transaction(async (tx) => {
      // 1. Obtener el producto con su receta completa
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      });

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // 2. Iterar por cada ingrediente de la receta
      for (const item of product.ingredients) {
        const currentIngredient = await tx.ingredient.findUnique({
          where: { id: item.ingredientId }
        });

        if (!currentIngredient) continue;

        const newStock = currentIngredient.stock - item.quantity;

        // 3. Verificar si hay suficiente stock
        if (newStock < 0) {
          // ✅ MEJORA: Usamos BadRequestException para un error 400 claro
          throw new BadRequestException(
            `Stock insuficiente para: ${currentIngredient.name}. ` +
            `Quedan: ${currentIngredient.stock}, Necesario: ${item.quantity}`
          );
        }

        // 4. Actualizar el stock en la base de datos
        await tx.ingredient.update({
          where: { id: item.ingredientId },
          data: { stock: newStock }
        });
      }

      return { 
        message: 'Venta realizada exitosamente', 
        product: product.name 
      };
    });
  }
}