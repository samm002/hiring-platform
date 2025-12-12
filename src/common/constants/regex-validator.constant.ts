export interface RegexValidatorRuleFormat {
  regex: RegExp;
  message: string;
}

export const RegexValidatorRule: Record<string, RegexValidatorRuleFormat> = {
  password: {
    regex: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
    message:
      'password must be at least 8 characters long, contain at least one uppercase letter and one number',
  },
} as const;
