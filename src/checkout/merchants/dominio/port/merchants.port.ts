import {
  ICreateCardRequest,
  ICreateCardResponse,
  ICreatePaymentSourceRequest,
  ICreatePaymentSourceResponse,
  ICReateTransactionCofRequest,
  IGetMerchantsResponse,
} from '../entities/merchants.entites';

export interface MerchantsPort {
  getMerchantsCustomer(): Promise<IGetMerchantsResponse>;
  postCreateCard(payload: ICreateCardRequest): Promise<ICreateCardResponse>;
  postCreatePaymentSource(
    payload: ICreatePaymentSourceRequest,
  ): Promise<ICreatePaymentSourceResponse>;
  postCreateTransactionCof(payload: ICReateTransactionCofRequest): Promise<any>;
}
