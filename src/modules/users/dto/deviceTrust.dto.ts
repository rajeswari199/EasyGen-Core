import { IsNotEmpty } from 'class-validator';

export class DeviceTrustDto {
  @IsNotEmpty()
  readonly deviceId: string;
}
