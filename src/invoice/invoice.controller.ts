import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto, PayInvoiceDto } from './dto';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { AdminGuard } from 'src/authentication/admin.guard';
import { ExportService } from '../export/export.service';
import { Response } from 'express';

@Controller('api/invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  // DI
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly exportService: ExportService,
  ) {}

  @Post()
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Put(':id/pay')
  payInvoice(@Param('id') id: string, @Body() payInvoiceDto: PayInvoiceDto) {
    return this.invoiceService.payInvoice(id, payInvoiceDto);
  }

  // admin can only delete invoices
  @Delete(':id')
  // @UseGuards(JwtAuthGuard, AdminGuard)
  deleteInvoice(@Param('id') id: string) {
    return this.invoiceService.deleteInvoice(id);
  }

  // get an invoice for admin
  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getInvoiceById(@Param('id') id: string) {
    const invoice = await this.invoiceService.getInvoiceById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  // get an invoice for customer
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAllInvoices() {
    return this.invoiceService.findAll();
  }

  //get all invoices for a customer as specified by customerid on rhe query string
  @Get('customer/:customerId')
  async getInvoicesForCustomer(@Param('customerId') customerId: string) {
    return this.invoiceService.getInvoicesForCustomer(customerId);
  }

  //generate pdf
  @Get('export/pdf/:invoiceId')
  async exportInvoicePdf(
    @Param('invoiceId') invoiceId: string,
    @Res() res: Response,
  ) {
    try {
      const pdfBuffer = await this.exportService.generateInvoicePdf(invoiceId);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=invoice-${invoiceId}.pdf`,
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  }

  // Export Excel admin
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('export/excel')
  async exportInvoicesExcel(@Res() res: Response) {
    try {
      const excelBuffer = await this.exportService.generateInvoicesExcel();
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=invoices-report.xlsx',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(excelBuffer);
    } catch (error) {
      res.status(500).send('Error generating Excel file');
    }
  }

  //export excel for customer
  @Get('export/excel/:customerId')
  async exportCustomerInvoicesExcel(
    @Param('customerId') customerId: string,
    @Res() res: Response,
  ) {
    try {
      const excelBuffer =
        await this.exportService.generateCustomersInvoicesExcel(customerId);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=invoices-report.xlsx',
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(excelBuffer);
    } catch (error) {
      res.status(500).send('Error generating Excel file');
    }
  }
}
