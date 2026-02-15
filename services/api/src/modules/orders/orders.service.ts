import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findAll(user: any) {
    return this.prisma.order.findMany({
      where: { tenantId: user.tenantId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  getStats(user: any, startDate?: string, endDate?: string) {
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      dateFilter.lt = end;
    }

    return this.prisma.order.aggregate({
      where: { 
        tenantId: user.tenantId,
        createdAt: dateFilter 
      },
      _sum: {
        total: true,
        totalCost: true
      },
      _count: {
        id: true,
      },
    }).then(result => {
      const revenue = result._sum.total || 0;
      const cost = result._sum.totalCost || 0;
      return {
        totalRevenue: revenue,
        totalCost: cost,
        totalProfit: revenue - cost,
        totalOrders: result._count.id || 0,
      };
    });
  }

  // --- MÉTODO NUEVO PARA ORDENES DE MESA ---
  async createOrder(user: any, createOrderDto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      let totalRevenue = 0;
      let totalCost = 0;
      const orderItemsToCreate = [];

      for (const item of createOrderDto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { ingredients: { include: { ingredient: true } } }
        });

        if (!product) throw new BadRequestException(`Producto no encontrado`);

        const itemTotal = product.price * item.quantity;
        totalRevenue += itemTotal;

        for (const recipeItem of product.ingredients) {
          const neededQty = recipeItem.quantity * item.quantity;
          
          const ingredient = await tx.ingredient.findUnique({
            where: { id: recipeItem.ingredientId }
          });

          if (!ingredient) continue;

          if (ingredient.stock < neededQty) {
            throw new BadRequestException(
              `Stock insuficiente para: ${ingredient.name}. (Quedan ${ingredient.stock}, Necesarios ${neededQty})`
            );
          }

          await tx.ingredient.update({
            where: { id: ingredient.id },
            data: { stock: { decrement: neededQty } }
          });

          totalCost += (neededQty * ingredient.cost);
        }

        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });
      }

      const order = await tx.order.create({
        data: {
          tableNumber: createOrderDto.tableNumber,
          total: totalRevenue,
          totalCost: totalCost,
          tenantId: user.tenantId,
          items: {
            create: orderItemsToCreate
          }
        },
        include: { items: true }
      });

      return order;
    });
  }
}