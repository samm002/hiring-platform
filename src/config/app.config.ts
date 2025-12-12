import { registerAs } from '@nestjs/config';
import { envValues } from './env';

const { APP_NAME } = envValues;

export const appConfig = registerAs('app', () => ({
  name: APP_NAME,
}));
