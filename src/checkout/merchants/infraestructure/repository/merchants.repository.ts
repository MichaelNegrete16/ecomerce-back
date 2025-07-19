import axios from 'axios';
import {
  ICreateCardRequest,
  ICreateCardResponse,
  ICreatePaymentSourceRequest,
  ICreatePaymentSourceResponse,
  ICReateTransactionCofRequest,
  ICreateTransactionResponse,
  IGetMerchantsResponse,
  IMerchantPaymentModel,
} from '../../dominio/entities/merchants.entites';
import { MerchantsPort } from '../../dominio/port/merchants.port';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantPaymentModel } from '../models/merchants.models';
import { Repository } from 'typeorm';

export class MerchanstsRepository implements MerchantsPort {
  constructor(
    @InjectRepository(MerchantPaymentModel)
    private readonly merchantPaymentModel: Repository<MerchantPaymentModel>,
  ) {}

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
      console.log(payload, 'payload in postCreatePaymentSource');

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
  ): Promise<ICreateTransactionResponse> {
    try {
      const response = await axios.post<ICreateTransactionResponse>(
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

  async saveTransaction(
    payload: IMerchantPaymentModel,
  ): Promise<IMerchantPaymentModel> {
    try {
      const create = this.merchantPaymentModel.create(payload);
      const save = await this.merchantPaymentModel.save(create);
      return save;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Métodos para gestión de transacciones en BD
  async getTransactionByReference(
    reference: string,
  ): Promise<IMerchantPaymentModel | null> {
    try {
      const transaction = await this.merchantPaymentModel.findOne({
        where: { bill_id: reference },
      });
      return transaction || null;
    } catch (error) {
      console.error('Error in getTransactionByReference:', error);
      throw error;
    }
  }

  async getTransactionStatus(
    transactionId: string,
  ): Promise<ICreateTransactionResponse> {
    try {
      const response = await axios.get<ICreateTransactionResponse>(
        `${process.env.ECOMER_API_SAMBOX}/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ECOMER_PRIVATE}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error in getTransactionStatus:', error);
      throw error;
    }
  }

  async updateTransactionStatus(
    payload: IMerchantPaymentModel,
  ): Promise<IMerchantPaymentModel> {
    try {
      const existingTransaction = await this.merchantPaymentModel.findOne({
        where: { bill_id: payload.reference },
      });

      if (!existingTransaction) {
        throw new Error(
          `Transaction with reference ${payload.reference} not found`,
        );
      }

      existingTransaction.status = payload.status;
      existingTransaction.status_message = payload.status_message;
      existingTransaction.payment_method = payload.payment_method;

      const updatedTransaction =
        await this.merchantPaymentModel.save(existingTransaction);
      return updatedTransaction;
    } catch (error) {
      console.error('Error in updateTransactionStatus:', error);
      throw error;
    }
  }

  async getTransactionsByStatus(
    status: string,
  ): Promise<IMerchantPaymentModel[]> {
    try {
      const transactions = await this.merchantPaymentModel.find({
        where: { status },
        order: { created_at: 'DESC' },
      });
      return transactions;
    } catch (error) {
      console.error('Error in getTransactionsByStatus:', error);
      throw error;
    }
  }
}
