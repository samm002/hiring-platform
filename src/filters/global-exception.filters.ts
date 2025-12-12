import { ResponseDto } from '@common/dto';
import { DefaultHttpStatus } from '@common/enums';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { extractChildrenErrors } from 'src/factories';
import { QueryFailedError } from 'typeorm';
import { TypeOrmExceptionFilter } from './typeorm-exception.filter';

interface ValidationErrorResponse {
  message: string[] | ValidationError[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly typeOrmExceptionFilter: TypeOrmExceptionFilter;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.typeOrmExceptionFilter = new TypeOrmExceptionFilter(httpAdapterHost);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // TypeORM/Database errors
    if (exception instanceof QueryFailedError) {
      this.logger.error('TypeORM / Database error');
      return this.typeOrmExceptionFilter.catch(
        exception as QueryFailedError<Error>,
        host,
      );
    }

    // Log the exception
    this.logger.error('HTTP Exception');
    this.logger.error(exception);

    // Determine status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const err =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    if (
      status === Number(HttpStatus.UNPROCESSABLE_ENTITY) &&
      typeof err === 'object' &&
      err !== null &&
      'message' in err
    ) {
      const errorResponse = err as ValidationErrorResponse;

      if (Array.isArray(errorResponse.message)) {
        const errors = errorResponse.message as ValidationError[];

        const validationData = errors.map((error) => ({
          field: error.property,
          message: [
            ...Object.values(error.constraints ?? {}),
            ...extractChildrenErrors(error.children ?? []),
          ],
        }));

        httpAdapter.reply(
          response,
          new ResponseDto(
            status,
            DefaultHttpStatus.Fail,
            'Unprocessable entity',
            validationData,
          ),
          status,
        );
        return;
      }
    }

    // Default Error Handling
    const errorStatus =
      status >= Number(HttpStatus.BAD_REQUEST) &&
      status < Number(HttpStatus.INTERNAL_SERVER_ERROR)
        ? DefaultHttpStatus.Fail
        : DefaultHttpStatus.Error;

    httpAdapter.reply(
      response,
      new ResponseDto(status, errorStatus, message.toLowerCase(), null),
      status,
    );
  }
}
