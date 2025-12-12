import { UserType } from '@common/enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { ValidateRegex } from 'src/decorators/validate-regex.decorator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsEnum(UserType, {
    message: `user type must be one of: ${Object.values(UserType).join(', ')}`,
  })
  @IsNotEmpty()
  readonly userType!: UserType;

  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @ValidateRegex('password')
  @IsNotEmpty()
  readonly password!: string;

  @IsNumberString()
  @IsNotEmpty()
  readonly phoneNumber!: string;
}

// TODO: upon create, default role of candidate is basic candidate
// TODO: upon create, default role of recruiter is basic recruiter
// TODO: upon create, default role of recruiter is basic admin
