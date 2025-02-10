import { TokenResponse } from './../jwt/jwt.interface';

export interface ForgotPasswordRequest {
  challengeToken: TokenResponse;
}
