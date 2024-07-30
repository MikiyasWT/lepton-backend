import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CustomerModule } from './customer/customer.module';
import { ItemModule } from './item/item.module';
import { InvoiceModule } from './invoice/invoice.module';
import { AuthModule } from './authentication/authentication.module';
import { AuthentnpxModule } from './prisma/authentnpx/authentnpx.module';

@Module({
  imports: [
    CustomerModule,
    ItemModule,
    InvoiceModule,
    AuthModule,
    AuthentnpxModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
