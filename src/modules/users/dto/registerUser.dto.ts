import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { convertCamelCaseToTitleCase } from '@utils/functions';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR } from '@messages/errorMessages';
import { CONSTANTS } from '@utils/constants';

@ValidatorConstraint({ name: 'stringsWithoutNumbers', async: false })
export class StringsWithoutNumbers implements ValidatorConstraintInterface {
  validate(value: string): boolean | Promise<boolean> {
    return /^([a-zA-Z]+\s)*[a-zA-Z]+$/.test(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${convertCamelCaseToTitleCase(
      validationArguments.property,
    )} cannot contain special characters and numbers`;
  }
}

export class RegisterUserDto {
  @Validate(StringsWithoutNumbers)
  @Length(3, 30, {
    message: ERROR.FIRST_NAME.LENGTH,
  })
  @IsString({ message: ERROR.FIRST_NAME.TYPE_STRING })
  @IsNotEmpty({ message: ERROR.FIRST_NAME.REQUIRED })
  firstName: string;

  @Validate(StringsWithoutNumbers)
  @Length(3, 30, {
    message: ERROR.LAST_NAME.LENGTH,
  })
  @IsString({ message: ERROR.LAST_NAME.TYPE_STRING })
  @IsNotEmpty({ message: ERROR.LAST_NAME.REQUIRED })
  lastName: string;

  @Matches(CONSTANTS.EMAIL_REGEX_PATTERN, {
    message: () => {
      throw new HttpException(
        ERROR.EMAIL.INVALID_FORMAT,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    },
  })
  @IsString({ message: ERROR.EMAIL.TYPE_STRING })
  @IsNotEmpty({ message: ERROR.EMAIL.REQUIRED })
  email: string;

  @Matches(CONSTANTS.PASSWORD_REGEX_PATTERN, {
    message: () => {
      throw new HttpException(
        ERROR.PASSWORD.INVALID_FORMAT,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    },
  })
  @Length(8, 60, {
    message: () => {
      throw new HttpException(
        ERROR.PASSWORD.LENGTH,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    },
  })
  @IsNotEmpty({ message: ERROR.PASSWORD.REQUIRED })
  password: string;
}
