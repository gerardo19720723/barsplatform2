import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../guards/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN') // Solo Dueños y Admins pueden crear
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    // Pasamos el usuario inyectado por el decorador al servicio
    return this.productsService.create(user, createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: any) {
    return this.productsService.findAll(user);
  }
}