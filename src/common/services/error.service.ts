import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ERROR } from '@messages/errorMessages';

export function UserNotFoundException(errorMessage?: string | object) {
  throw new NotFoundException(errorMessage ?? ERROR.USER.NOT_FOUND);
}

export function BadRequest(errorMessage?: string | object) {
  throw new BadRequestException(errorMessage ?? ERROR.USER.NOT_FOUND);
}
