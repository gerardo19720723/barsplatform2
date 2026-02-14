import { IsString, IsNumber } from 'class-validator';

export class AddIngredientDto {
  @IsString()
  ingredientId: string; // ID del "Pan de Hamburguesa"

  @IsNumber()
  quantity: number; // Cuánto se necesita (ej: 1 pan)
}