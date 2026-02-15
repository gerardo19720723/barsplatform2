import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

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
}