import { IsString, Matches } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ERROR } from '@messages/errorMessages';
import { CONSTANTS } from '@utils/constants';

export class IsUserExistDto {
  @IsString({ message: ERROR.EMAIL.TYPE_STRING })
  @Matches(CONSTANTS.EMAIL_REGEX_PATTERN, {
    message: () => {
      throw new HttpException(
        ERROR.EMAIL.INVALID_FORMAT,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    },
  })
  email: string;

}
