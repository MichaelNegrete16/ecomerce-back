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
} from '../dominio/entities/merchants.entites';

export class MerchantsCaseUse {
  constructor(private readonly merchantsPort: MerchantsPort) {}

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
      console.log('Error in createTransactionCof:', error);
      throw new HttpException(
        'Error al crear la transacción COF',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async CreateTransaction(
    payload: ICReateTransactionRequest,
  ): Promise<ICreateTransactionResponse> {
    try {
      const formatDataCard = {
        number: payload.number,
        exp_month: payload.exp_month,
        exp_year: payload.exp_year,
        cvc: payload.cvc,
        card_holder: payload.card_holder,
      };

      const responseCard = await this.createValidateCard(formatDataCard);
      if (!responseCard?.data?.id) {
        throw new HttpException(
          'Error al crear la tarjeta, verifique los datos',
          HttpStatus.BAD_REQUEST,
        );
      }

      const formatDataPaymentSource = {
        type: 'CARD',
        token: responseCard.data.id,
        customer_email: payload.customer_email,
        acceptance_token: payload.acceptance_token,
        accept_personal_auth: payload.accept_personal_auth,
      };

      const response = await this.createPaymentSource(formatDataPaymentSource);
      const reference = `ECORM${Date.now()}${response?.data.id}`;
      const amount = payload.amount_in_cents;
      const key = process.env.ECOMER_INTEGRIDAD;
      const createValuesSignature = `${reference}${amount}COP${key}`;
      const responseSignature = await this.createSignature(
        createValuesSignature,
      );

      const formatDataTransaction = {
        amount_in_cents: payload.amount_in_cents, // Monto current centavos
        currency: 'COP', // Moneda
        signature: responseSignature, //Firma de integridad
        customer_email: payload.customer_email, // Email del usuario
        payment_method: {
          installments: 2, // Número de cuotas si la fuente de pago representa una tarjeta de lo contrario el campo payment_method puede ser ignorado.
        },
        reference: reference, // Referencia única de pago
        payment_source_id: response?.data.id, // ID de la fuente de pago
      };

      const responseTransaction = await this.createTransactionCof(
        formatDataTransaction,
      );

      return responseTransaction;
    } catch (error) {
      console.log('Error in CreateTransaction:', error);
      throw new HttpException(
        'Hubo en error al crear la transacción',
        HttpStatus.BAD_REQUEST,
      );
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
}
