import { ResponseDto } from '@common/dto';
import { DefaultHttpStatus } from '@common/enums';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

export enum PostgreSqlErrorCode {
  NotFound = '23000',
  RelationNotFound = '23503',
  Conflict = '23505',
}

// Type definition for PostgreSQL driver error
interface PostgreSqlDriverError extends Error {
  code?: string;
  detail?: string;
  table?: string;
  constraint?: string;
}

export function sanitizePostgresqlErrorResponse(message: string): string {
  return message
    .replace(/Key /, '') // Remove "Key "
    .replace(/\((.*?)\)/g, '$1') // Remove parentheses ()
    .replace(/=/g, ' '); // Replace '=' with space
}

// Type guard to check if error is PostgreSQL error
function isPostgreSqlError(error: Error): error is PostgreSqlDriverError {
  return 'code' in error && 'detail' in error;
}

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeOrmExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = exception.message;
    let status = HttpStatus.BAD_REQUEST;

    const driverError = exception.driverError;

    // Check if it's a PostgreSQL error
    if (driverError && isPostgreSqlError(driverError)) {
      const errorCode = driverError.code;

      if (errorCode === PostgreSqlErrorCode.Conflict) {
        status = HttpStatus.CONFLICT;
        message = sanitizePostgresqlErrorResponse(
          driverError.detail ?? 'Duplicated entry',
        );
      } else if (errorCode === PostgreSqlErrorCode.NotFound) {
        status = HttpStatus.NOT_FOUND;
        message = sanitizePostgresqlErrorResponse(
          driverError.detail ?? 'Not found',
        );
      } else if (errorCode === PostgreSqlErrorCode.RelationNotFound) {
        status = HttpStatus.BAD_REQUEST;
        message = sanitizePostgresqlErrorResponse(
          driverError.detail ?? 'Bad request',
        );

        // Safely check if detail exists and contains the pattern
        if (driverError.detail?.includes('is not present in table')) {
          const match = driverError.detail.match(
            /\((.+?)\)=\(.+?\) is not present in table "(.+?)"/,
          );

          if (match && match[1] && driverError.table) {
            const field = match[1];
            message = `Failed to create ${driverError.table}, ${field.replace('_id', '')} not found`;
          }
        }
      }
    }

    this.logger.error('TypeORM Query Failed Error:');
    this.logger.error(exception);

    httpAdapter.reply(
      response,
      new ResponseDto(status, DefaultHttpStatus.Error, message, null),
      status,
    );
  }
}
