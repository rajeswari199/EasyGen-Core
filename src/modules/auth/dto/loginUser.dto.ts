import { IsNotEmpty, Length, Matches } from 'class-validator';

import { ERROR } from '@messages/errorMessages';
import { CONSTANTS } from '@utils/constants';
import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginUserDto {
  @Matches(CONSTANTS.EMAIL_REGEX_PATTERN, {
    message: () => {
      throw new HttpException(
        ERROR.EMAIL.INVALID_FORMAT,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    },
  })
  @IsNotEmpty({ message: ERROR.EMAIL.REQUIRED })
  email?: string;

  @Length(8, 60, { message: ERROR.USER.INVALID_EMAIL_OR_PASSWORD })
  @IsNotEmpty({ message: ERROR.PASSWORD.REQUIRED })
  password: string;

  @IsNotEmpty()
  readonly deviceId: string;
}
