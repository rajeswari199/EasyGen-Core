import { IsNotEmpty, IsMongoId } from 'class-validator';

export class VerifyUserParamDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly userId: string;
}
