import {
  ICreateCardRequest,
  ICreateCardResponse,
  ICreatePaymentSourceRequest,
  ICreatePaymentSourceResponse,
  ICReateTransactionCofRequest,
  ICreateTransactionResponse,
  IGetMerchantsResponse,
  IMerchantPaymentModel,
} from '../entities/merchants.entites';

export interface MerchantsPort {
  getMerchantsCustomer(): Promise<IGetMerchantsResponse>;
  postCreateCard(payload: ICreateCardRequest): Promise<ICreateCardResponse>;
  postCreatePaymentSource(
    payload: ICreatePaymentSourceRequest,
  ): Promise<ICreatePaymentSourceResponse>;
  postCreateTransactionCof(
    payload: ICReateTransactionCofRequest,
  ): Promise<ICreateTransactionResponse>;
  saveTransaction(
    payload: IMerchantPaymentModel,
  ): Promise<IMerchantPaymentModel>;

  // Nuevos métodos para gestión de transacciones
  getTransactionByReference(
    reference: string,
  ): Promise<IMerchantPaymentModel | null>;
  getTransactionStatus(
    transactionId: string,
  ): Promise<ICreateTransactionResponse>;
  updateTransactionStatus(
    payload: IMerchantPaymentModel,
  ): Promise<IMerchantPaymentModel>;
  getTransactionsByStatus(status: string): Promise<IMerchantPaymentModel[]>;
}
