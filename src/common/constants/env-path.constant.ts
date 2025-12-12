import { Environment } from '@common/enums/environment.enum';

export const envPaths: Partial<Record<Environment, string[]>> = {
  [Environment.Production]: ['.env.production.local', '.env.local', '.env'],
  [Environment.Development]: ['.env.development.local', '.env.local', '.env'],
};
