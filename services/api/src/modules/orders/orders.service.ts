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
}