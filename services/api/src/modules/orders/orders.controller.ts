import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '@/guards/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(
    @CurrentUser() user: any,
    @Query('start') startDate?: string, // <--- LEER PARÁMETROS
    @Query('end') endDate?: string
  ) {
    return this.ordersService.getStats(user, startDate, endDate);
  }

  @Post()
    @UseGuards(JwtAuthGuard)
    @Roles('OWNER', 'ADMIN', 'STAFF') // Staff también puede crear órdenes
    create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any) {
      return this.ordersService.createOrder(user, createOrderDto);
    }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
  @Param('id') id: string, 
  @Body() body: { status: string }
  ) {
    return this.ordersService.updateStatus(id, body.status);
  }
}