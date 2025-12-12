import { RegexValidatorRule } from '@common/constants';
import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Matches } from 'class-validator';

export function ValidateRegex(field: keyof typeof RegexValidatorRule) {
  const validator = RegexValidatorRule[field];

  if (!validator) {
    throw new BadRequestException(`invalid regex rule in field: "${field}"`);
  }

  return applyDecorators(
    Matches(validator.regex, {
      message: validator.message,
    }),
  );
}
