import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';

@Module({
  providers: [PrismaService, InvoiceService],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
