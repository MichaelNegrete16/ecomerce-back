import { Module } from '@nestjs/common';
import { MerchantsModule } from './merchants/merchants.module';
import { ArticlesModule } from './article/article.module';

@Module({
  imports: [MerchantsModule, ArticlesModule],
  controllers: [],
  providers: [],
})
export class CheckoutModule {}
