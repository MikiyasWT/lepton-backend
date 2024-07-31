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

@Controller('api/items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.createItem(createItemDto);
  }

  @Put(':id')
  updateItem(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.updateItem(id, updateItemDto);
  }

  @Get(':id')
  getItemById(@Param('id') id: string) {
    return this.itemService.getItemById(id);
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return this.itemService.deleteItem(id);
  }

  @Get()
  getAllItems() {
    return this.itemService.findAll();
  }
}
