export interface IGetPaymentProcessorsResponse {
  name: string;
}

export interface IGetPaymentMethodsResponse {
  name: string;
  payment_processors: IGetPaymentProcessorsResponse[];
}

export interface IDataMerchants {
  id: number;
  name: string;
  email: string;
  contact_name: string;
  phone_number: string;
  active: boolean;
  logo_url: string | null;
  legal_name: string;
  legal_id_type: string;
  legal_id: string;
  public_key: string;
  accepted_currencies: string[];
  fraud_javascript_key: string | null;
  fraud_groups: any[];
  accepted_payment_methods: string[];
  payment_methods: IGetPaymentMethodsResponse[];
  presigned_acceptance: {
    acceptance_token: string;
    permalink: string;
    type: string;
  };
  presigned_personal_data_auth: {
    acceptance_token: string;
    permalink: string;
    type: string;
  };
}

export interface IGetMerchantsResponse {
  data: IDataMerchants;
}
export interface IGetDataMerchant {
  presigned_acceptance: {
    acceptance_token: string;
    permalink: string;
    type: string;
  };
  presigned_personal_data_auth: {
    acceptance_token: string;
    permalink: string;
    type: string;
  };
}
export interface ICreateCardRequest {
  number: string; // Número de tarjeta (como un string, sin espacios)
  exp_month: string; // Mes de expiración (como string de 2 dígitos)
  exp_year: string; // Año de expiración (como string de 2 dígitos)
  cvc: string; // Código de seguridad (como string de 3 o 4 dígitos)
  card_holder: string; // Nombre del tarjeta habiente (string de mínimo 5 caracteres)
}

export interface ICreatePaymentSourceRequest {
  type: string;
  token: string;
  customer_email: string;
  acceptance_token: string;
  accept_personal_auth: string;
}

export interface ICreatePaymentSourceResponse {
  data: {
    id: number;
    public_data: {
      type: string;
    };
    type: string;
    status: string;
  };
}

export interface ICReateTransactionRequest {
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
  card_holder: string;
  customer_email: string;
  acceptance_token: string;
  accept_personal_auth: string;
  amount_in_cents: number; // Monto current centavos
  currency: string; // Moneda
}

export interface ICreateCardResponse {
  status: string;
  data: {
    id: string;
    created_at: string;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
    created_with_cvc: true;
    expires_at: string;
    validity_ends_at: string;
  };
}

export interface ICReateTransactionCofRequest {
  amount_in_cents: number; // Monto current centavos
  currency: string; // Moneda
  signature: string; //Firma de integridad
  customer_email: string; // Email del usuario
  payment_method: {
    installments: number; // Número de cuotas si la fuente de pago representa una tarjeta de lo contrario el campo payment_method puede ser ignorado.
  };
  reference: string; // Referencia única de pago
  payment_source_id: number | undefined; // ID de la fuente de pago
}

export interface ICreateTransactionResponse {
  data: {
    id: string;
    created_at: string;
    finalized_at: string | null;
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string;
    payment_method_type: string;
    payment_method: {
      type: string;
      extra: {
        bin: string;
        name: string;
        brand: string;
        exp_year: string;
        card_type: string;
        exp_month: string;
        last_four: string;
        card_holder: string;
        is_three_ds: boolean;
        three_ds_auth_type: string | null;
      };
      installments: number;
    };
    status: string;
    status_message: string | null;
    billing_data: Record<string, unknown> | null;
    shipping_address: Record<string, unknown> | null;
    redirect_url: string | null;
    payment_source_id: number;
    payment_link_id: string | null;
    customer_data: Record<string, unknown> | null;
    bill_id: string | null;
    taxes: Record<string, unknown>[];
    tip_in_cents: number | null;
  };
}
