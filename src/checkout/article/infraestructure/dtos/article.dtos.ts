import { ApiProperty } from '@nestjs/swagger';
import { IArticleProduct } from '../../dominio/entitie/article.entities';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RatingDto {
  @ApiProperty({ example: 4.5, description: 'Average rating of the product' })
  @IsNumber()
  @Min(0)
  rate: number;

  @ApiProperty({ example: 100, description: 'Number of ratings' })
  @IsNumber()
  @Min(0)
  count: number;
}

export class IArticleDto implements IArticleProduct {
  @ApiProperty({
    description: 'Titulo del artículo',
    example: 'Camiseta',
    type: 'string',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descripción del artículo',
    example: 'Camiseta de algodón orgánico',
    type: 'string',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Categoría del artículo',
    example: 'Ropa',
    type: 'string',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Precio del artículo',
    example: 19.99,
    type: 'number',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Precio original del artículo',
    example: 24.99,
    type: 'number',
    required: false,
  })
  @IsNumber()
  originalPrice?: number;

  @ApiProperty({
    description: 'Imagen del artículo',
    example: 'https://example.com/image.jpg',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Imágenes adicionales del artículo',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: 'array',
    items: { type: 'string' },
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({
    description: 'Calificación del artículo',
    example: { rate: 4.5, count: 100 },
    type: 'object',
    properties: {
      rate: { type: 'number', example: 4.5 },
      count: { type: 'number', example: 100 },
    },
    additionalProperties: false,
  })
  @ValidateNested()
  @Type(() => RatingDto)
  rating: RatingDto;

  @ApiProperty({
    description: 'Insignia del artículo',
    example: 'Nuevo',
    type: 'string',
  })
  @IsString()
  badge: string;

  @ApiProperty({
    description: 'Descuento del artículo',
    example: 10,
    type: 'number',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    description: 'Cantidad disponible del artículo',
    example: 50,
    type: 'number',
  })
  @IsNumber()
  stock: number;
}
