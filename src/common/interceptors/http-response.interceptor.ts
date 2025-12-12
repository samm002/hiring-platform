import { ResponseDto } from '@common/dto';
import { DefaultHttpStatus } from '@common/enums';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HTTPResponseInterceptor<T> implements NestInterceptor<
  T | ResponseDto<T>,
  ResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T | ResponseDto<T>>,
  ): Observable<ResponseDto<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data): ResponseDto<T> => {
        // If already wrapped in ResponseDto, return as-is
        if (data instanceof ResponseDto) {
          return data;
        }

        // Auto-wrap raw data in success response
        const statusCode = response.statusCode || HttpStatus.OK;
        const wrappedData = data ?? null;

        return new ResponseDto<T>(
          statusCode,
          DefaultHttpStatus.Success,
          'success',
          wrappedData as T,
        );
      }),
    );
  }
}
