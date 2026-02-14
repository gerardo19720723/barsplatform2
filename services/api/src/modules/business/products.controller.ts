import { Controller, Get, Post, Body, UseGuards, Delete, Param } from '@nestjs/common';
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

  @Post(':id/ingredients')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  addIngredient(
    @Param('id') productId: string, 
    @Body() body: { ingredientId: string; quantity: number }
  ) {
    // Llamamos al método que ya tienes en tu Service
    return this.productsService.addIngredientToRecipe({
      productId: productId,
      ingredientId: body.ingredientId,
      quantity: body.quantity
    });
  }

  @Delete('recipe')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  removeIngredientFromRecipe(@Body() body: { productId: string; ingredientId: string }) {
    return this.productsService.removeIngredientFromRecipe(body.productId, body.ingredientId);
  }
  
  @Post(':id/sell')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'STAFF')
  sellProduct(@Param('id') productId: string) {
    // Aquí probamos la lógica avanzada de transacciones que escribiste
    return this.productsService.sellProduct(productId);
  }
}