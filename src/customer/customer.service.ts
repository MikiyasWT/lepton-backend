import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(data: CreateCustomerDto) {
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existingCustomer) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.customer.create({
      data: {
        ...data,
        password: hashedPassword,
      },
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

  async findAll() {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }, // Correct ordering
    });
  }
}
