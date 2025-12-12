import { join } from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default new DataSource({
  applicationName: process.env.APP_NAME ?? 'hiring_platform',
  type: process.env.DB_TYPE as PostgresConnectionOptions['type'],
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10) ?? 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'development' ? true : ['error'], // // log all in development,  otherwise only log error
  synchronize: false,
  cache: false,
  entities: [join(__dirname, '../modules/**/entities/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
});
