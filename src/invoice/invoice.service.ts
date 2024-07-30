import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateInvoiceDto, PayInvoiceDto } from './dto';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(data: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: {
        customer: {
          connect: { id: data.customerId },
        },
        total_amount: data.total_amount,
        due_date: data.due_date,
        status: 'Pending', // default status
        items: {
          create: data.items.map((item) => ({
            item: { connect: { id: item.itemId } },
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.quantity * item.unit_price,
          })),
        },
      },
      include: { items: true },
    });
  }

  async payInvoice(id: string, data: PayInvoiceDto) {
    return this.prisma.invoice.update({
      where: { id },
      data,
    });
  }

  async deleteInvoice(id: string) {
    return this.prisma.invoice.delete({
      where: { id },
    });
  }

  async getInvoiceById(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' }, // Correct ordering
      include: { items: true },
    });
  }
}
