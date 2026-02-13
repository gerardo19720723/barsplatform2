import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../../guards/roles.guard';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService, RolesGuard],
})
export class BusinessModule {}