import { Module } from '@nestjs/common';
import { MerchantsController } from './infraestructure/controllers/merchants.controller';
import { MerchanstsRepository } from './infraestructure/repository/merchants.repository';

@Module({
  imports: [],
  controllers: [MerchantsController],
  providers: [MerchanstsRepository],
})
export class MerchantsModule {}
