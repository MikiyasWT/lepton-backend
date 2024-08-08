import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { ExportModule } from 'src/export/export.module';
import { ExportService } from 'src/export/export.service';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [ExportModule], // Import the module that contains ExportService
  providers: [InvoiceService, ExportService, CustomerService, PrismaService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
