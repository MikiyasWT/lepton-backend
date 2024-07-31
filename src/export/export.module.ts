import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [ExportService, PrismaService],
  exports: [ExportService], // Export ExportService to make it available to other modules
})
export class ExportModule {}
