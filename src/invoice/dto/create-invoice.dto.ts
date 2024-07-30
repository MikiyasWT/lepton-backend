import { IsString, IsDecimal, IsArray, IsDate } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  customerId: string;

  @IsDecimal()
  total_amount: number;

  @IsDate()
  due_date: Date;

  @IsArray()
  items: {
    itemId: string;
    quantity: number;
    unit_price: number;
  }[];

  @IsString()
  status: string;
}
