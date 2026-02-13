import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Ruta relativa correcta
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; role: string; tenantId?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: data.role as any, 
        tenantId: data.tenantId,
      },
    });
  }
}
