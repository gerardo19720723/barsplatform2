import { IsArray, IsNumber, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  tableNumber: string; // "Mesa 5", "Barra", etc.

  @IsArray()
  @ValidateNested({ each: true })
   @Type(() => OrderItemDto)
  items: OrderItemDto[];
}