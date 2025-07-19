import { ConfigService, registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

const env = dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });
console.log('rocess.env.NODE_ENV', process.env.NODE_ENV);

const configService = new ConfigService({ load: [() => env] });

const IS_LOCAL = configService.get<string>('NODE_ENV') === 'local';

export const database = {
  ECOMER_DB_TYPE: configService.get<string>('ECOMER_DB_TYPE'),
  ECOMER_DB_HOST: configService.get<string>('ECOMER_DB_HOST'),
  ECOMER_DB_PORT: configService.get<string>('ECOMER_DB_PORT'),
  ECOMER_DB_DATABASE: configService.get<string>('ECOMER_DB_DATABASE'),
  ECOMER_DB_USERNAME: configService.get<string>('ECOMER_DB_USERNAME'),
  ECOMER_DB_PASSWORD: configService.get<string>('ECOMER_DB_PASSWORD'),
  entities: [
    'src/**/*.{model,modelo}{.ts,.js}',
    '!src/migrate-data/**/*.model{.ts,.js}',
  ],
  seeds: ['src/**/*.seed.service{.ts,.js}'],
  synchronize: IS_LOCAL, // never use TRUE in production!
  //   synchronize: true, // never use TRUE in production!
  timezone: configService.get<string>('TZ'),
};

export const config = {
  database,
  node_env: configService.get<string>('NODE_ENV'),
  ECOMER_PORT: configService.get<string>('ECOMER_PORT'),
  ECOMER_API_SAMBOX: configService.get<string>('ECOMER_API_SAMBOX'),
  ECOMER_PUBLI: configService.get<string>('ECOMER_PUBLI'),
  ECOMER_PRIVATE: configService.get<string>('ECOMER_PRIVATE'),
  ECOMER_EVENT: configService.get<string>('ECOMER_EVENT'),
  ECOMER_INTEGRIDAD: configService.get<string>('ECOMER_INTEGRIDAD'),
};

export default registerAs('config', () => config);
