import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(data: CreateCustomerDto) {
    return this.prisma.customer.create({
      data,
    });
  }

  async updateCustomer(id: string, data: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async getCustomerById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async deleteCustomer(id: string) {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
