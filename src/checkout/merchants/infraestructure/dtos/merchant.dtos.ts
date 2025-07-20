import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  Length,
  Min,
  Matches,
} from 'class-validator';
import { ICReateTransactionRequest } from '../../dominio/entities/merchants.entites';

export class MerchantsDto implements ICReateTransactionRequest {
  @ApiProperty({
    description:
      'Número de tarjeta de crédito o débito (sin espacios ni guiones)',
    example: '4242424242424242',
    minLength: 13,
    maxLength: 19,
  })
  @IsString({ message: 'El número de tarjeta debe ser un string' })
  @IsNotEmpty({ message: 'El número de tarjeta es requerido' })
  @Length(13, 19, {
    message: 'El número de tarjeta debe tener entre 13 y 19 dígitos',
  })
  @Matches(/^\d+$/, {
    message: 'El número de tarjeta solo debe contener dígitos',
  })
  number: string;

  @ApiProperty({
    description: 'Mes de expiración de la tarjeta (formato MM)',
    example: '06',
    minLength: 2,
    maxLength: 2,
  })
  @IsString({ message: 'El mes de expiración debe ser un string' })
  @IsNotEmpty({ message: 'El mes de expiración es requerido' })
  @Length(2, 2, {
    message: 'El mes de expiración debe tener exactamente 2 dígitos',
  })
  @Matches(/^(0[1-9]|1[0-2])$/, {
    message: 'El mes de expiración debe estar entre 01 y 12',
  })
  exp_month: string;

  @ApiProperty({
    description: 'Año de expiración de la tarjeta (formato YY)',
    example: '29',
    minLength: 2,
    maxLength: 2,
  })
  @IsString({ message: 'El año de expiración debe ser un string' })
  @IsNotEmpty({ message: 'El año de expiración es requerido' })
  @Length(2, 2, {
    message: 'El año de expiración debe tener exactamente 2 dígitos',
  })
  @Matches(/^\d{2}$/, { message: 'El año de expiración debe ser numérico' })
  exp_year: string;

  @ApiProperty({
    description: 'Código de seguridad de la tarjeta (CVV/CVC)',
    example: '123',
    minLength: 3,
    maxLength: 4,
  })
  @IsString({ message: 'El código de seguridad debe ser un string' })
  @IsNotEmpty({ message: 'El código de seguridad es requerido' })
  @Length(3, 4, {
    message: 'El código de seguridad debe tener entre 3 y 4 dígitos',
  })
  @Matches(/^\d+$/, {
    message: 'El código de seguridad solo debe contener dígitos',
  })
  cvc: string;

  @ApiProperty({
    description: 'Nombre completo del titular de la tarjeta',
    example: 'Pedro Pérez García',
    minLength: 5,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre del titular debe ser un string' })
  @IsNotEmpty({ message: 'El nombre del titular es requerido' })
  @Length(5, 100, {
    message: 'El nombre del titular debe tener entre 5 y 100 caracteres',
  })
  card_holder: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'pepito.perez@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  customer_email: string;

  @ApiProperty({
    description:
      'Token de aceptación obtenido del endpoint /merchants/generate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'El token de aceptación debe ser un string' })
  @IsNotEmpty({ message: 'El token de aceptación es requerido' })
  acceptance_token: string;

  @ApiProperty({
    description:
      'Token de autorización de datos personales obtenido del endpoint /merchants/generate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({
    message: 'El token de autorización de datos personales debe ser un string',
  })
  @IsNotEmpty({
    message: 'El token de autorización de datos personales es requerido',
  })
  accept_personal_auth: string;

  @ApiProperty({
    description:
      'Monto de la transacción en centavos (ej: $49,900 = 4990000 centavos)',
    example: 4990000,
    minimum: 100,
  })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @IsNotEmpty({ message: 'El monto es requerido' })
  @Min(100, { message: 'El monto mínimo es de 100 centavos ($1 peso)' })
  amount_in_cents: number;

  @ApiProperty({
    description: 'Código de moneda ISO 4217',
    example: 'COP',
    enum: ['COP'],
    default: 'COP',
  })
  @IsString({ message: 'La moneda debe ser un string' })
  @IsNotEmpty({ message: 'La moneda es requerida' })
  @Matches(/^COP$/, {
    message: 'Por el momento solo se acepta la moneda COP (Pesos Colombianos)',
  })
  currency: string;

  @ApiProperty({
    description: 'ID del artículo que se está comprando',
    example: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: 'El ID del artículo debe ser un número' })
  @IsNotEmpty({ message: 'El ID del artículo es requerido' })
  @Min(1, { message: 'El ID del artículo debe ser mayor a 0' })
  id_article: number;

  @ApiProperty({
    description:
      'Monto total de la compra (puede diferir del monto de la transacción por descuentos, impuestos, etc.)',
    example: 10,
    minimum: 1,
  })
  @IsNumber({}, { message: 'El monto de la compra debe ser un número' })
  @IsNotEmpty({ message: 'El monto de la compra es requerido' })
  @Min(1, {
    message: 'No se proporciono la cantidad de artículos a comprar',
  })
  amount_purchase: number;
}
