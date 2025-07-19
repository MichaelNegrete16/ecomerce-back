import { Module } from '@nestjs/common';
import { MerchantsModule } from './merchants/merchants.module';

@Module({
  imports: [MerchantsModule],
  controllers: [],
  providers: [],
})
export class CheckoutModule {}
