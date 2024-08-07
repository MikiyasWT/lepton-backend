import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

//only a customer with an admin role can run this controller
//for admin purposes
// for test purpose use email mikiywendu44@gmail.com and password 123456

@Controller('api/customers')
// @UseGuards(JwtAuthGuard, AdminGuard)
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  @Put(':id')
  updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.updateCustomer(id, updateCustomerDto);
  }

  @Get(':id')
  getCustomerById(@Param('id') id: string) {
    return this.customerService.getCustomerById(id);
  }

  @Delete(':id')
  deleteCustomer(@Param('id') id: string) {
    return this.customerService.deleteCustomer(id);
  }

  @Get()
  getAllCustomers() {
    return this.customerService.findAll();
  }
}
