import { Module } from '@nestjs/common';
import { MerchantsController } from './infraestructure/controllers/merchants.controller';
import { MerchanstsRepository } from './infraestructure/repository/merchants.repository';
import { MerchantPaymentModel } from './infraestructure/models/merchants.models';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantPaymentModel])],
  controllers: [MerchantsController],
  providers: [MerchanstsRepository],
})
export class MerchantsModule {}
