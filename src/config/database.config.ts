import { Environment } from '@common/enums';
import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { envValues } from './env';

const {
  APP_NAME,
  DB_TYPE,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  NODE_ENV,
} = envValues;

export const databaseConfig = registerAs('database', () => ({
  applicationName: APP_NAME,
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: NODE_ENV === Environment.Development ? true : ['error'], // log all in development,  otherwise only log error
  synchronize: false,
  cache: false,
  entities: [
    join(__dirname, '../common/**/entities/*.entity{.ts,.js}'),
    join(__dirname, '../modules/**/entities/*.entity{.ts,.js}'),
  ],
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
}));
