import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';

export function extractChildrenErrors(children?: ValidationError[]): string[] {
  if (!children || children.length === 0) return [];
  return children.flatMap((child) =>
    Object.values(child.constraints || {}).concat(
      extractChildrenErrors(child.children),
    ),
  );
}

export function validationExceptionFactory(errors: ValidationError[]) {
  const formattedErrors = errors.map((error) => ({
    field: error.property,
    message: Object.values(error.constraints || {}).concat(
      extractChildrenErrors(error.children),
    ),
  }));

  return new UnprocessableEntityException({
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    message: 'Validation Failed',
    errors: formattedErrors,
  });
}
