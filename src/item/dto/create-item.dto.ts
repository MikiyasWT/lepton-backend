import { IsString, IsInt, IsDecimal } from 'class-validator';

export class CreateItemDto {
  @IsString()
  description: string;

  @IsInt()
  quantity: number;

  @IsDecimal()
  unit_price: number;
}
