import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Module({
  providers: [PrismaService, CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
