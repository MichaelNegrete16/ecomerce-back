import { HttpException, HttpStatus } from '@nestjs/common';
import { MerchantsPort } from '../dominio/port/merchants.port';
import {
  ICreateCardRequest,
  ICreateCardResponse,
  ICreatePaymentSourceRequest,
  ICreatePaymentSourceResponse,
  ICReateTransactionCofRequest,
  ICReateTransactionRequest,
  ICreateTransactionResponse,
  IGetDataMerchant,
  IMerchantPaymentModel,
} from '../dominio/entities/merchants.entites';
import { IArticleProductPort } from 'src/checkout/article/dominio/port/article.port';

export class MerchantsCaseUse {
  constructor(
    private readonly merchantsPort: MerchantsPort,
    private readonly articlePort: IArticleProductPort,
  ) {}

  async getMerchants(): Promise<IGetDataMerchant> {
    try {
      const response = await this.merchantsPort.getMerchantsCustomer();
      return {
        presigned_acceptance: response.data.presigned_acceptance,
        presigned_personal_data_auth:
          response.data.presigned_personal_data_auth,
      };
    } catch (error) {
      console.log('Error in getMerchants:', error);
      throw new HttpException(
        'Hubo en error al realizar la consulta',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createValidateCard(
    payload: ICreateCardRequest,
  ): Promise<ICreateCardResponse> {
    try {
      const response = await this.merchantsPort.postCreateCard(payload);
      if (!response.status) {
        throw new HttpException(
          'Error al crear la tarjeta, verifique los datos',
          HttpStatus.BAD_REQUEST,
        );
      }
      return response;
    } catch (error) {
      console.log('Error in accepMerchant:', error);
      throw new HttpException(
        'Error al crear la tarjeta, verifique los datos',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createPaymentSource(
    payload: ICreatePaymentSourceRequest,
  ): Promise<ICreatePaymentSourceResponse | null> {
    try {
      const response =
        await this.merchantsPort.postCreatePaymentSource(payload);
      return response;
    } catch (error) {
      console.log('Error in createPaymentSource:', error);
      throw new HttpException(
        'Error al crear el source de pago',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createTransactionCof(
    payload: ICReateTransactionCofRequest,
  ): Promise<ICreateTransactionResponse> {
    try {
      const response =
        await this.merchantsPort.postCreateTransactionCof(payload);

      return response;
    } catch (error) {
      console.log('Error in createTransactionCof:', error.message);
      throw new HttpException(
        'Error al crear la transacción COF',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async CreateTransaction(
    payload: ICReateTransactionRequest,
  ): Promise<IMerchantPaymentModel> {
    try {
      for (const article of payload.articles) {
        if (isNaN(article.id)) {
          throw new HttpException(
            'ID de artículo inválido',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (isNaN(article.amount)) {
          throw new HttpException(
            'Cantidad de artículo inválida',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (article.amount <= 0) {
          throw new HttpException(
            'La cantidad del artículo debe ser mayor a cero',
            HttpStatus.BAD_REQUEST,
          );
        }

        const result = await this.articlePort.getArticleById(
          article.id.toString(),
        );

        if (!result) {
          throw new HttpException(
            'Artículo no encontrado',
            HttpStatus.NOT_FOUND,
          );
        }
      }

      const responseCard = await this.createValidateCard({
        number: payload.number,
        exp_month: payload.exp_month,
        exp_year: payload.exp_year,
        cvc: payload.cvc,
        card_holder: payload.card_holder,
      });
      if (!responseCard?.data?.id) {
        throw new HttpException(
          'Error al crear la tarjeta, verifique los datos',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = await this.createPaymentSource({
        type: 'CARD',
        token: responseCard.data.id,
        customer_email: payload.customer_email,
        acceptance_token: payload.acceptance_token,
        accept_personal_auth: payload.accept_personal_auth,
      });
      const reference = `ECORM${Date.now()}${response?.data.id}`;
      const amount = payload.amount_in_cents;
      const key = process.env.ECOMER_INTEGRIDAD;
      const createValuesSignature = `${reference}${amount}COP${key}`;
      const responseSignature = await this.createSignature(
        createValuesSignature,
      );

      const responseTransaction = await this.createTransactionCof({
        amount_in_cents: payload.amount_in_cents,
        currency: 'COP',
        signature: responseSignature,
        customer_email: payload.customer_email,
        payment_method: {
          installments: 2,
        },
        reference: reference,
        payment_source_id: response?.data.id,
      });

      const saveTransaction = await this.merchantsPort.saveTransaction({
        reference: reference,
        status: responseTransaction.data.status,
        status_message: responseTransaction.data.status_message,
        payment_method: responseTransaction.data.payment_method,
        amount_in_cents: responseTransaction.data.amount_in_cents,
        currency: responseTransaction.data.currency,
        customer_email: responseTransaction.data.customer_email,
        payment_link_id: responseTransaction.data.payment_link_id,
        bill_id: responseTransaction.data.id,
      });

      for (const article of payload.articles) {
        const articleData = await this.articlePort.getArticleById(
          article.id.toString(),
        );

        if (!articleData) {
          throw new HttpException(
            'Artículo no encontrado',
            HttpStatus.NOT_FOUND,
          );
        }

        const newStock = articleData.stock - article.amount;
        const isInStock = newStock > 0;
        await this.articlePort.updateArticle(article.id.toString(), {
          stock: newStock,
          inStock: isInStock,
        });
      }

      return saveTransaction;
    } catch (error) {
      console.log('Error in CreateTransaction:', error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  createSignature = async (cadena: string) => {
    const encondedText = new TextEncoder().encode(cadena);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  };

  async getTransactionStatus(transactionId: string): Promise<{
    currentStatus: string;
    hasChanged: boolean;
    originalTransaction: IMerchantPaymentModel | null;
    updatedTransaction?: ICreateTransactionResponse;
  }> {
    try {
      const savedTransaction =
        await this.merchantsPort.getTransactionByReference(transactionId);

      if (!savedTransaction) {
        throw new HttpException(
          'Transacción no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      const currentTransactionStatus =
        await this.merchantsPort.getTransactionStatus(transactionId);

      const hasChanged =
        savedTransaction.status !== currentTransactionStatus.data.status;

      if (hasChanged) {
        await this.merchantsPort.updateTransactionStatus({
          reference: transactionId,
          status: currentTransactionStatus.data.status,
          status_message: currentTransactionStatus.data.status_message,
          payment_method: currentTransactionStatus.data.payment_method,
          amount_in_cents: currentTransactionStatus.data.amount_in_cents,
          currency: currentTransactionStatus.data.currency,
          customer_email: currentTransactionStatus.data.customer_email,
          payment_link_id: currentTransactionStatus.data.payment_link_id,
          bill_id: currentTransactionStatus.data.id,
        });

        return {
          currentStatus: currentTransactionStatus.data.status,
          hasChanged: true,
          originalTransaction: savedTransaction,
          updatedTransaction: currentTransactionStatus,
        };
      }

      return {
        currentStatus: savedTransaction.status,
        hasChanged: false,
        originalTransaction: savedTransaction,
      };
    } catch (error) {
      console.log('Error in getTransactionStatus:', error);
      throw new HttpException(
        'Error al consultar el estado de la transacción',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPendingTransactions(): Promise<IMerchantPaymentModel[]> {
    try {
      return await this.merchantsPort.getTransactionsByStatus('PENDING');
    } catch (error) {
      console.log('Error in getPendingTransactions:', error);
      throw new HttpException(
        'Error al consultar transacciones pendientes',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
