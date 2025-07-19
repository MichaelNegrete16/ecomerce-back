import { IGetMerchantsResponse } from '../entities/merchants.entites';

export interface MerchantsPort {
  getMerchantsCustomer(): Promise<IGetMerchantsResponse>;
}
