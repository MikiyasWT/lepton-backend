import { IsString } from 'class-validator';

export class PayInvoiceDto {
  @IsString()
  status: 'Paid' | 'Pending';
}
