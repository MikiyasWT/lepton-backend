import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, PayInvoiceDto } from './dto';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { AdminGuard } from 'src/authentication/admin.guard';
import { CustomerGuard } from 'src/authentication/customer.guard';

@Controller('api/invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Put(':id/pay')
  @UseGuards(JwtAuthGuard, AdminGuard, CustomerGuard)
  payInvoice(@Param('id') id: string, @Body() payInvoiceDto: PayInvoiceDto) {
    return this.invoiceService.payInvoice(id, payInvoiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteInvoice(@Param('id') id: string) {
    return this.invoiceService.deleteInvoice(id);
  }

  // for admin
  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    const invoice = await this.invoiceService.getInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  // for customer
  @Get('customer/:customerId/:invoiceId')
  async getInvoiceByIdCustomer(
    @Param('customerId') customerId: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    try {
      const invoice = await this.invoiceService.getInvoiceByIdCustomer(
        customerId,
        invoiceId,
      );
      return invoice;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('An unexpected error occurred');
    }
  }

  // get all invoices for an admin role
  @Get()
  getAllInvoices() {
    return this.invoiceService.findAll();
  }

  //get all invoices for a customer as specified by customerid on rhe query string
  @Get('customer/:customerId')
  async getInvoicesForCustomer(@Param('customerId') customerId: string) {
    return this.invoiceService.getInvoicesForCustomer(customerId);
  }
}
