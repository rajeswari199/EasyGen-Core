import { ERROR } from '@messages/errorMessages';
import { IsNotEmpty, IsString } from 'class-validator';

export class RenewTokenDto {
  @IsString()
  @IsNotEmpty({ message: ERROR.REFRESH_TOKEN.NO_TOKEN })
  refreshToken: string;
}
