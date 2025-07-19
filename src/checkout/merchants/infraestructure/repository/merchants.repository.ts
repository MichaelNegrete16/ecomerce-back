import axios from 'axios';
import {
  ICreateCardRequest,
  ICreateCardResponse,
  ICreatePaymentSourceRequest,
  ICreatePaymentSourceResponse,
  ICReateTransactionCofRequest,
  IGetMerchantsResponse,
} from '../../dominio/entities/merchants.entites';
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

  async postCreateCard(
    payload: ICreateCardRequest,
  ): Promise<ICreateCardResponse> {
    try {
      const response = await axios.post<ICreateCardResponse>(
        `${process.env.ECOMER_API_SAMBOX}/tokens/cards`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.ECOMER_PUBLI}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error in postCreateCard:', error);
      throw error;
    }
  }

  async postCreatePaymentSource(
    payload: ICreatePaymentSourceRequest,
  ): Promise<ICreatePaymentSourceResponse> {
    try {
      const response = await axios.post<ICreatePaymentSourceResponse>(
        `${process.env.ECOMER_API_SAMBOX}/payment_sources`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.ECOMER_PRIVATE}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error in postCreatePaymentSource:', error);
      throw error;
    }
  }

  async postCreateTransactionCof(
    payload: ICReateTransactionCofRequest,
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.ECOMER_API_SAMBOX}/transactions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.ECOMER_PRIVATE}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error in postCreateTransactionCof:', error);
      throw error;
    }
  }
}
