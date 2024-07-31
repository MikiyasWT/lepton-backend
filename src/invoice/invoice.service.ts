import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateInvoiceDto, PayInvoiceDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(data: CreateInvoiceDto) {
    const itemsData = await Promise.all(
      data.items.map(async (item) => {
        const foundItem = await this.prisma.item.findUnique({
          where: { id: item.itemId },
        });

        if (!foundItem) {
          throw new NotFoundException({
            message: `Item with id ${item.itemId} not found`,
            error: 'Not Found',
            statusCode: 404,
          });
        }

        if (foundItem.quantity < item.quantity) {
          throw new BadRequestException({
            message: `Insufficient quantity for item with id ${item.itemId}`,
            error: 'Bad Request',
            statusCode: 400,
          });
        }

        const total = new Decimal(foundItem.unit_price).mul(item.quantity);

        return {
          itemId: item.itemId,
          quantity: item.quantity,
          unit_price: foundItem.unit_price,
          total: total.toNumber(),
          description: foundItem.description, // Include description
        };
      }),
    );

    const totalAmount = itemsData.reduce((acc, item) => acc + item.total, 0);

    const createdInvoice = await this.prisma.invoice.create({
      data: {
        customer: {
          connect: { id: data.customerId },
        },
        total_amount: totalAmount,
        due_date: data.due_date,
        status: 'Pending', // default status
        items: {
          create: itemsData.map((item) => ({
            item: { connect: { id: item.itemId } },
            description: item.description, // Use the description from itemsData
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });

    // Update item quantities after invoice is created
    await Promise.all(
      itemsData.map(async (item) => {
        await this.prisma.item.update({
          where: { id: item.itemId },
          data: { quantity: { decrement: item.quantity } }, // Decrease quantity
        });
      }),
    );

    return createdInvoice;
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

  // for admin
  async getInvoiceById(id: string) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  //for customer
  async getInvoiceByIdCustomer(customerId: string, invoiceId: string) {
    // Find the invoice and include items
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
    });

    // Check if the invoice exists and is associated with the given customerId
    if (!invoice || invoice.customerId !== customerId) {
      throw new NotFoundException({
        message: `Invoice with id ${invoiceId} not found for customer with id ${customerId}`,
        error: 'Not Found',
        statusCode: 404,
      });
    }

    return invoice;
  }

  async getInvoicesForCustomer(customerId: string) {
    return this.prisma.invoice.findMany({
      where: { customerId },
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
