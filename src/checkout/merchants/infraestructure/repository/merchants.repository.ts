import axios from 'axios';
import { IGetMerchantsResponse } from '../../dominio/entities/merchants.entites';
import { MerchantsPort } from '../../dominio/port/merchants.port';

export class MerchanstsRepository implements MerchantsPort {
  async getMerchantsCustomer(): Promise<IGetMerchantsResponse> {
    try {
      const response = await axios.get<IGetMerchantsResponse>(
        `${process.env.ECOMER_API_SAMBOX}/merchants/${process.env.ECOMER_PUBLI}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error in getMerchantsCustomer:', error);
      throw error;
    }
  }
}
