import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(data: CreateItemDto) {
    return this.prisma.item.create({
      data,
    });
  }

  async updateItem(id: string, data: UpdateItemDto) {
    return this.prisma.item.update({
      where: { id },
      data,
    });
  }

  async getItemById(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException({
        message: 'Item Not Found',
        error: 'Not Found',
        statusCode: 404,
      });
    }

    return item;
  }

  async deleteItem(id: string) {
    return this.prisma.item.delete({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.item.findMany({
      orderBy: { createdAt: 'desc' }, // Correct ordering
    });
  }
}
