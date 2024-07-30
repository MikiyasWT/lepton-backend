import { Injectable } from '@nestjs/common';
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
    return this.prisma.item.findUnique({
      where: { id },
    });
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
