import { IsString, IsInt, IsDecimal } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  description?: string;

  @IsInt()
  quantity?: number;

  @IsDecimal()
  unit_price?: number;
}
