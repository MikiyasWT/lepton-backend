import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';

@Module({
  providers: [PrismaService, ItemService],
  controllers: [ItemController],
})
export class ItemModule {}
