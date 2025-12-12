import { Environment } from '@common/enums';
import { envConfig, EnvironmentVariables } from './env.config';

envConfig();

export const envValues: EnvironmentVariables = {
  NODE_ENV: (process.env.NODE_ENV as Environment) || Environment.Development,
  APP_NAME: process.env.APP_NAME || 'hiring_platform',
  API_VERSION: process.env.API_VERSION || 'v1',
  DB_TYPE: process.env.DB_TYPE || '',
  DB_PORT: process.env.DB_PORT || '',
  DB_HOST: process.env.DB_HOST || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
  JWT_AT_SECRET: process.env.JWT_AT_SECRET || '',
  JWT_RT_SECRET: process.env.JWT_RT_SECRET || '',
  JWT_AT_EXPIRE: process.env.JWT_AT_EXPIRE || '',
  JWT_RT_EXPIRE: process.env.JWT_RT_EXPIRE || '',
};
