import { DefaultHttpStatus } from '@common/enums';
import { HttpStatus } from '@nestjs/common';

/**
 * @description This project uses the JSend API specification.
 * @see https://github.com/omniti-labs/jsend
 */
export class MetaDto {
  code: number;
  status: DefaultHttpStatus;
  message: string;
}

export class ResponseDto<T> {
  meta: MetaDto;
  data?: T;

  constructor(
    code: number,
    status: DefaultHttpStatus,
    message: string,
    data?: T,
  ) {
    this.meta = { code, status, message };
    this.data = data;
  }

  /**
   * Creates a success response
   * Use when everything went well (successful reequest)
   */
  static success<T>(
    data: T,
    message = 'success',
    code = HttpStatus.OK,
  ): ResponseDto<T> {
    return new ResponseDto(code, DefaultHttpStatus.Success, message, data);
  }

  /**
   * Creates an error response
   * Use for server errors or unexpected issues
   */
  static error<T = null>(
    message: string = 'error',
    code = HttpStatus.INTERNAL_SERVER_ERROR,
    data: T | null = null,
  ): ResponseDto<T | null> {
    return new ResponseDto(code, DefaultHttpStatus.Error, message, data);
  }

  /**
   * Creates a fail response
   * Use for validation errors or client-side issues
   */
  static fail<T = any>(
    message: string = 'fail',
    data: T,
    code = HttpStatus.BAD_REQUEST,
  ): ResponseDto<T> {
    return new ResponseDto(code, DefaultHttpStatus.Fail, message, data);
  }
}
