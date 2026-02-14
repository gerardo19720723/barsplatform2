import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../guards/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  create(@Body() body: { name: string; unit: string; stock: number }, @CurrentUser() user: any) {
    return this.ingredientsService.create(user, body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: any) {
    return this.ingredientsService.findAll(user);
  }
}