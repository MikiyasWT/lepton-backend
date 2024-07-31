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
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { AdminGuard } from 'src/authentication/admin.guard';
import { CustomerGuard } from 'src/authentication/customer.guard';

//all controller actions need authorization
//customer with admin role can run all controllers
//customer with role customer can access getItemById & getAllItems

@Controller('api/items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.createItem(createItemDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  updateItem(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.updateItem(id, updateItemDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard, CustomerGuard)
  getItemById(@Param('id') id: string) {
    return this.itemService.getItemById(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteItem(@Param('id') id: string) {
    return this.itemService.deleteItem(id);
  }

  @Get()
  getAllItems() {
    return this.itemService.findAll();
  }
}
