import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ArticleCaseUse } from '../../aplication/article.caseuse';
import { ArticleRepository } from '../repository/article.repository';
import { IArticleDto } from '../dtos/article.dtos';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  private readonly articleCaseUse: ArticleCaseUse;
  constructor(readonly articleRepository: ArticleRepository) {
    this.articleCaseUse = new ArticleCaseUse(this.articleRepository);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Crear un nuevo artículo',
    description:
      'Crea un nuevo artículo en el catálogo del ecommerce. Este endpoint permite agregar productos al inventario con toda su información relevante como nombre, descripción, precio, stock, etc.',
  })
  @ApiBody({
    description: 'Datos del artículo a crear',
    type: 'object',
    examples: {
      example1: {
        summary: 'Ejemplo de artículo básico',
        value: {
          name: 'Smartphone Samsung Galaxy S24',
          description:
            'Teléfono inteligente de última generación con cámara de 50MP y 128GB de almacenamiento',
          price: 2499000,
          stock: 15,
          category: 'Electrónicos',
          brand: 'Samsung',
          sku: 'SAM-GAL-S24-128',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Artículo creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 1,
          description: 'ID único del artículo',
        },
        name: { type: 'string', example: 'Smartphone Samsung Galaxy S24' },
        description: {
          type: 'string',
          example: 'Teléfono inteligente de última generación...',
        },
        price: {
          type: 'number',
          example: 2499000,
          description: 'Precio en pesos colombianos',
        },
        stock: {
          type: 'number',
          example: 15,
          description: 'Cantidad disponible en inventario',
        },
        category: { type: 'string', example: 'Electrónicos' },
        brand: { type: 'string', example: 'Samsung' },
        sku: {
          type: 'string',
          example: 'SAM-GAL-S24-128',
          description: 'Código único del producto',
        },
        isActive: {
          type: 'boolean',
          example: true,
          description: 'Estado activo/inactivo del artículo',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-07-20T10:30:00Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-07-20T10:30:00Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Error en la validación de datos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'El nombre del artículo es requerido',
            'El precio debe ser un número positivo',
            'El stock no puede ser negativo',
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
        message: {
          type: 'string',
          example: 'Error interno al crear el artículo',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async createArticle(@Body() payload: IArticleDto) {
    return this.articleCaseUse.createArticle(payload);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los artículos',
    description:
      'Recupera la lista completa de artículos del catálogo. Incluye información detallada de cada producto como precios, stock disponible, categorías y estado de activación. Útil para mostrar el inventario completo o construir catálogos de productos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de artículos obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 1,
            description: 'ID único del artículo',
          },
          name: { type: 'string', example: 'Smartphone Samsung Galaxy S24' },
          description: {
            type: 'string',
            example: 'Teléfono inteligente de última generación...',
          },
          price: {
            type: 'number',
            example: 2499000,
            description: 'Precio en pesos colombianos',
          },
          stock: {
            type: 'number',
            example: 15,
            description: 'Cantidad disponible en inventario',
          },
          category: { type: 'string', example: 'Electrónicos' },
          brand: { type: 'string', example: 'Samsung' },
          sku: {
            type: 'string',
            example: 'SAM-GAL-S24-128',
            description: 'Código único del producto',
          },
          isActive: {
            type: 'boolean',
            example: true,
            description: 'Estado activo/inactivo del artículo',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-07-20T10:30:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-07-20T10:30:00Z',
          },
        },
      },
      example: [
        {
          id: 1,
          name: 'Smartphone Samsung Galaxy S24',
          description:
            'Teléfono inteligente de última generación con cámara de 50MP',
          price: 2499000,
          stock: 15,
          category: 'Electrónicos',
          brand: 'Samsung',
          sku: 'SAM-GAL-S24-128',
          isActive: true,
          createdAt: '2025-07-20T10:30:00Z',
          updatedAt: '2025-07-20T10:30:00Z',
        },
        {
          id: 2,
          name: 'Laptop Dell Inspiron 15',
          description:
            'Laptop para uso profesional con procesador Intel Core i7',
          price: 3499000,
          stock: 8,
          category: 'Computadores',
          brand: 'Dell',
          sku: 'DELL-INS-15-I7',
          isActive: true,
          createdAt: '2025-07-20T11:15:00Z',
          updatedAt: '2025-07-20T11:15:00Z',
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno del servidor al consultar artículos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Error interno al consultar los artículos',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async getAllArticles() {
    return this.articleCaseUse.getAllArticles();
  }
}
