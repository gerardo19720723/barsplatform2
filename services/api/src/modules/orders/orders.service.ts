import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findAll(user: any) {
    return this.prisma.order.findMany({
      where: { tenantId: user.tenantId },
      include: {
        items: {
          include: {
            product: true // Traer el nombre del producto
          }
        }
      },
      orderBy: { createdAt: 'desc' } // Los más recientes primero
    });
  }
    // Calcular estadísticas para el Dashboard
  async getStats(user: any, startDate?: string, endDate?: string) {
    // Preparamos el filtro de fechas
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) {
      // Para incluir todo el día de la fecha final, sumamos 1 día
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      dateFilter.lt = end;
    }

    const result = await this.prisma.order.aggregate({
      where: { 
        tenantId: user.tenantId,
        createdAt: dateFilter // <--- APLICAR FILTRO
      },
      _sum: {
        total: true,
        totalCost: true
      },
      _count: {
        id: true,
      },
    });

    const revenue = result._sum.total || 0;
    const cost = result._sum.totalCost || 0;

    return {
      totalRevenue: revenue,
      totalCost: cost,
      totalProfit: revenue - cost,
      totalOrders: result._count.id || 0,
    };
  }
}