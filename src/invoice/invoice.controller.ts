import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, PayInvoiceDto } from './dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Put(':id/pay')
  payInvoice(@Param('id') id: string, @Body() payInvoiceDto: PayInvoiceDto) {
    return this.invoiceService.payInvoice(id, payInvoiceDto);
  }

  @Delete(':id')
  deleteInvoice(@Param('id') id: string) {
    return this.invoiceService.deleteInvoice(id);
  }

  @Get(':id')
  getInvoiceById(@Param('id') id: string) {
    return this.invoiceService.getInvoiceById(id);
  }
}
