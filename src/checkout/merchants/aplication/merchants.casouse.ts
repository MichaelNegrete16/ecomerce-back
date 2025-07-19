import { HttpException, HttpStatus } from '@nestjs/common';
import { MerchantsPort } from '../dominio/port/merchants.port';

export class MerchantsCaseUse {
  constructor(private readonly merchantsPort: MerchantsPort) {}

  async getMerchants() {
    try {
      const response = await this.merchantsPort.getMerchantsCustomer();
      console.log('response', response);
    } catch (error) {
      console.log('Error in getMerchants:', error);
      throw new HttpException(
        'Hubo en error al realizar la consulta',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
