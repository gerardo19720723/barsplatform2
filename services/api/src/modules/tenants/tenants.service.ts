import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(createTenantDto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: {
        name: createTenantDto.name,
        subdomain: createTenantDto.subdomain,
        status: 'ACTIVE',
      },
    });
  }

  async findAll() {
    return this.prisma.tenant.findMany();
  }
}