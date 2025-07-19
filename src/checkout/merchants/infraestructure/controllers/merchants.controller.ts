import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MerchantsCaseUse } from '../../aplication/merchants.casouse';
import { MerchanstsRepository } from '../repository/merchants.repository';
import { ICReateTransactionRequest } from '../../dominio/entities/merchants.entites';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantsController {
  private readonly merchantsCaseUse: MerchantsCaseUse;
  constructor(readonly merchantsRepository: MerchanstsRepository) {
    this.merchantsCaseUse = new MerchantsCaseUse(this.merchantsRepository);
  }

  @Get('generate')
  async getMerchants() {
    return this.merchantsCaseUse.getMerchants();
  }

  @Post('create-transaction')
  async createValidateCard(@Body() payload: ICReateTransactionRequest) {
    return this.merchantsCaseUse.CreateTransaction(payload);
  }
}
