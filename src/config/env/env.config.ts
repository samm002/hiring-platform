import { envPaths } from '@common/constants';
import { Environment } from '@common/enums';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { config, DotenvConfigOptions } from 'dotenv';

export class EnvironmentVariables {
  @IsEnum(Environment, {
    message: `NODE_ENV environment variable must be one of: ${Object.values(Environment).join(', ')}`,
  })
  @IsOptional()
  NODE_ENV?: Environment | null;

  @IsString()
  @IsOptional()
  API_VERSION?: string | null;

  @IsString()
  @IsOptional()
  APP_NAME?: string | null;

  @IsString()
  @IsOptional()
  HOST?: string | null;

  @IsNumber()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT?: number | null;

  @IsString()
  @IsNotEmpty()
  DB_TYPE!: string;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @IsString()
  @IsNotEmpty()
  DB_PORT!: string;

  @IsString()
  @IsNotEmpty()
  DB_USER!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;

  @IsString()
  @IsNotEmpty()
  JWT_AT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_RT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_AT_EXPIRE!: string;

  @IsString()
  @IsNotEmpty()
  JWT_RT_EXPIRE!: string;
}

export function currentEnvuronment(): Environment {
  return (process.env.NODE_ENV as Environment) || Environment.Development;
}

export function envConfig(options?: DotenvConfigOptions) {
  return config({
    path: envPaths[currentEnvuronment()],
    ...options,
  });
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
