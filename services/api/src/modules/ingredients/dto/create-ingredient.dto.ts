import { IsString, IsNumber } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  name: string; // Ej: "Pan de Hamburguesa"

  @IsString()
  unit: string; // Ej: "Unidades", "Kg", "Litros"

  @IsNumber()
  stock: number; // Cantidad inicial

  @IsNumber()
  cost: number;
}