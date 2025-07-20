import { Module } from '@nestjs/common';
import { MerchantsController } from './infraestructure/controllers/merchants.controller';
import { MerchanstsRepository } from './infraestructure/repository/merchants.repository';
import { MerchantPaymentModel } from './infraestructure/models/merchants.models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from '../article/article.module';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantPaymentModel]), ArticlesModule],
  controllers: [MerchantsController],
  providers: [MerchanstsRepository],
})
export class MerchantsModule {}
