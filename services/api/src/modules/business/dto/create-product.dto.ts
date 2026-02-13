import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
  
  @IsString()
  categoryId: string; // Bebida, Comida, etc.
}