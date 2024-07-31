import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { JwtAuthGuard } from 'src/authentication/auth.guard';

@Controller('api/customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getCustomerById(@Param('id') id: string) {
    return this.customerService.getCustomerById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllCustomers() {
    return this.customerService.findAll();
  }
}
