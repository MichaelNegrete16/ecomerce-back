import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { MerchantsCaseUse } from '../../aplication/merchants.casouse';
import { MerchanstsRepository } from '../repository/merchants.repository';
import { ArticleRepository } from 'src/checkout/article/infraestructure/repository/article.repository';
import { MerchantsDto } from '../dtos/merchant.dtos';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantsController {
  private readonly merchantsCaseUse: MerchantsCaseUse;
  constructor(
    readonly merchantsRepository: MerchanstsRepository,
    readonly articleRepository: ArticleRepository,
  ) {
    this.merchantsCaseUse = new MerchantsCaseUse(
      this.merchantsRepository,
      this.articleRepository,
    );
  }

  @Get('generate')
  @ApiOperation({
    summary: 'Obtener datos del merchant',
    description:
      'Obtiene la información del merchant incluyendo los tokens de aceptación y autorización de datos personales necesarios para procesar pagos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del merchant obtenidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        presigned_acceptance: {
          type: 'object',
          properties: {
            acceptance_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            permalink: {
              type: 'string',
              example: 'https:/ecomerce/terms-and-conditions',
            },
            type: { type: 'string', example: 'END_USER_AGREEMENT' },
          },
        },
        presigned_personal_data_auth: {
          type: 'object',
          properties: {
            acceptance_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            permalink: {
              type: 'string',
              example: 'https://ecomerce/privacy-policy',
            },
            type: { type: 'string', example: 'PERSONAL_DATA_AUTH_AGREEMENT' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error al realizar la consulta',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Hubo en error al realizar la consulta',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async getMerchants() {
    return this.merchantsCaseUse.getMerchants();
  }

  @Post('create-transaction')
  @ApiOperation({
    summary: 'Crear una nueva transacción de pago',
    description:
      'Procesa una transacción de pago con tarjeta de crédito. Este endpoint maneja todo el flujo: validación de tarjeta, creación de fuente de pago, generación de firma de integridad y procesamiento de la transacción.',
  })
  @ApiBody({
    description: 'Datos necesarios para procesar la transacción',
    schema: {
      type: 'object',
      required: [
        'number',
        'exp_month',
        'exp_year',
        'cvc',
        'card_holder',
        'customer_email',
        'acceptance_token',
        'accept_personal_auth',
        'amount_in_cents',
        'currency',
      ],
      properties: {
        number: {
          type: 'string',
          description: 'Número de tarjeta (sin espacios)',
          example: '4242424242424242',
        },
        exp_month: {
          type: 'string',
          description: 'Mes de expiración (2 dígitos)',
          example: '06',
        },
        exp_year: {
          type: 'string',
          description: 'Año de expiración (2 dígitos)',
          example: '29',
        },
        cvc: {
          type: 'string',
          description: 'Código de seguridad (3 o 4 dígitos)',
          example: '123',
        },
        card_holder: {
          type: 'string',
          description: 'Nombre del tarjetahabiente (mínimo 5 caracteres)',
          example: 'Pedro Pérez',
        },
        customer_email: {
          type: 'string',
          format: 'email',
          description: 'Email del cliente',
          example: 'pepito_perez@example.com',
        },
        acceptance_token: {
          type: 'string',
          description: 'Token de aceptación obtenido del endpoint /generate',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        accept_personal_auth: {
          type: 'string',
          description:
            'Token de autorización de datos personales obtenido del endpoint /generate',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        amount_in_cents: {
          type: 'number',
          description: 'Monto de la transacción en centavos',
          example: 4990000,
          minimum: 1,
        },
        currency: {
          type: 'string',
          description: 'Moneda de la transacción',
          example: 'COP',
          enum: ['COP'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Transacción creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '15113-1752887263-64892' },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-07-19T01:07:47.718Z',
            },
            finalized_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
            amount_in_cents: { type: 'number', example: 4990000 },
            reference: { type: 'string', example: 'ECORM175288726246527977' },
            customer_email: {
              type: 'string',
              example: 'pepito_perez@example.com',
            },
            currency: { type: 'string', example: 'COP' },
            payment_method_type: { type: 'string', example: 'CARD' },
            payment_method: {
              type: 'object',
              properties: {
                type: { type: 'string', example: 'CARD' },
                extra: {
                  type: 'object',
                  properties: {
                    bin: { type: 'string', example: '424242' },
                    name: { type: 'string', example: 'VISA-4242' },
                    brand: { type: 'string', example: 'VISA' },
                    exp_year: { type: 'string', example: '29' },
                    card_type: { type: 'string', example: 'CREDIT' },
                    exp_month: { type: 'string', example: '06' },
                    last_four: { type: 'string', example: '4242' },
                    card_holder: { type: 'string', example: 'Pedro Pérez' },
                    is_three_ds: { type: 'boolean', example: false },
                    three_ds_auth_type: {
                      type: 'string',
                      nullable: true,
                      example: null,
                    },
                  },
                },
                installments: { type: 'number', example: 2 },
              },
            },
            status: {
              type: 'string',
              example: 'PENDING',
              enum: ['PENDING', 'APPROVED', 'DECLINED', 'VOIDED'],
            },
            status_message: { type: 'string', nullable: true, example: null },
            payment_source_id: { type: 'number', example: 27977 },
            payment_link_id: { type: 'string', nullable: true, example: null },
            bill_id: { type: 'string', nullable: true, example: null },
            taxes: { type: 'array', items: { type: 'object' }, example: [] },
            tip_in_cents: { type: 'number', nullable: true, example: null },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error en la validación de datos o procesamiento',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Error al crear la tarjeta, verifique los datos',
          enum: [
            'Error al crear la tarjeta, verifique los datos',
            'Error al crear el source de pago',
            'Error al crear la transacción COF',
            'Hubo en error al crear la transacción',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async createValidateCard(@Body() payload: MerchantsDto) {
    return this.merchantsCaseUse.CreateTransaction(payload);
  }

  @Get('transaction/status/:bill_id')
  @ApiOperation({
    summary: 'Consultar estado de una transacción',
    description:
      'Consulta el estado actual de una transacción y verifica si ha cambiado desde la última consulta. Útil para implementar polling desde el frontend.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de la transacción consultado exitosamente',
    schema: {
      type: 'object',
      properties: {
        currentStatus: {
          type: 'string',
          example: 'APPROVED',
          enum: ['PENDING', 'APPROVED', 'DECLINED', 'VOIDED'],
        },
        hasChanged: {
          type: 'boolean',
          example: true,
          description: 'Indica si el estado cambió desde la última consulta',
        },
        originalTransaction: {
          type: 'object',
          description: 'Datos de la transacción guardada en nuestra BD',
          nullable: true,
        },
        updatedTransaction: {
          type: 'object',
          description:
            'Datos actualizados de la transacción (solo si hasChanged=true)',
          nullable: true,
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error al consultar el estado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Error al consultar el estado de la transacción',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async getTransactionStatus(@Param('bill_id') bill_id: string) {
    return this.merchantsCaseUse.getTransactionStatus(bill_id);
  }

  @Get('transactions/pending')
  @ApiOperation({
    summary: 'Obtener y actualizar transacciones pendientes',
    description:
      'Obtiene todas las transacciones en estado PENDING, verifica automáticamente su estado actual en la API externa y actualiza aquellas que hayan cambiado. Retorna estadísticas del procesamiento y la lista actualizada de transacciones que siguen pendientes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Transacciones pendientes procesadas exitosamente',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          example: 5,
          description: 'Total de transacciones pendientes verificadas',
        },
        updated: {
          type: 'number',
          example: 2,
          description: 'Número de transacciones que cambiaron de estado',
        },
        transactions: {
          type: 'array',
          description:
            'Lista de transacciones que siguen pendientes después de la verificación',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              reference: { type: 'string', example: 'ECORM175288726246527977' },
              status: { type: 'string', example: 'PENDING' },
              amount_in_cents: { type: 'number', example: 4990000 },
              currency: { type: 'string', example: 'COP' },
              customer_email: {
                type: 'string',
                example: 'pepito_perez@example.com',
              },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
        },
        statusChanges: {
          type: 'array',
          description: 'Lista de cambios de estado detectados',
          items: {
            type: 'object',
            properties: {
              reference: {
                type: 'string',
                example: 'ECORM175288726246527977',
                description: 'Referencia de la transacción que cambió',
              },
              oldStatus: {
                type: 'string',
                example: 'PENDING',
                description: 'Estado anterior',
              },
              newStatus: {
                type: 'string',
                example: 'APPROVED',
                description: 'Estado nuevo detectado',
              },
            },
          },
          example: [
            {
              reference: 'ECORM175288726246527977',
              oldStatus: 'PENDING',
              newStatus: 'APPROVED',
            },
            {
              reference: 'ECORM175288726246527988',
              oldStatus: 'PENDING',
              newStatus: 'DECLINED',
            },
          ],
        },
      },
      example: {
        total: 5,
        updated: 2,
        transactions: [
          {
            id: 3,
            reference: 'ECORM175288726246527999',
            status: 'PENDING',
            amount_in_cents: 2990000,
            currency: 'COP',
            customer_email: 'maria@example.com',
            created_at: '2025-07-21T10:30:00Z',
          },
        ],
        statusChanges: [
          {
            reference: 'ECORM175288726246527977',
            oldStatus: 'PENDING',
            newStatus: 'APPROVED',
          },
          {
            reference: 'ECORM175288726246527988',
            oldStatus: 'PENDING',
            newStatus: 'DECLINED',
          },
        ],
      },
    },
  })
  async getPendingTransactions() {
    return this.merchantsCaseUse.getPendingTransactions();
  }
}
