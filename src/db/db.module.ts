import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, type ConfigType } from '@nestjs/config';

import config from '../config';
// modulo de la base de datos
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    // configuracion de la base de datos para la conexion
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        // propiedades para la conexion
        return {
          type: configService.database.ECOMER_DB_TYPE,
          host: configService.database.ECOMER_DB_HOST,
          port: configService.database.ECOMER_DB_PORT,
          username: configService.database.ECOMER_DB_USERNAME,
          password: configService.database.ECOMER_DB_PASSWORD,
          database: configService.database.ECOMER_DB_DATABASE,
          autoLoadEntities: true,
          synchronize: configService.database.synchronize,
          useSanitizeQuery: true,
          //dropSchema: true,
        } as TypeOrmModuleOptions;
      },
    }),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class DatabaseModule {}
