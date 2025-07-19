import { ConfigModule } from '@nestjs/config/dist/config.module';
import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm/data-source';

import { config, database } from 'src/config';

ConfigModule.forRoot({
  envFilePath: `.env.${config.node_env}`,
});
const options = ['local', 'test'];
const IS_LOCAL = options.includes(config.node_env!);

export const optionsDatabase = {
  type: database.ECOMER_DB_TYPE as 'postgres',
  host: database.ECOMER_DB_HOST,
  port: +database.ECOMER_DB_PORT!,
  database: database.ECOMER_DB_DATABASE,
  username: database.ECOMER_DB_USERNAME,
  password: database.ECOMER_DB_PASSWORD,
  entities: database.entities,
  seeds: database.seeds,
  synchronize: IS_LOCAL, // never use TRUE in production!
  //dropSchema: true,
  /*logging: true,
  logger: "advanced-console"*/
};

export const dataSource = new DataSource(
  optionsDatabase as DataSourceOptions & SeederOptions,
);
