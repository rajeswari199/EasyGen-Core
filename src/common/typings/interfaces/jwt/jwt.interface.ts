export interface JwtExpiry {
  ninetyDays: string;
  tenMinutes: number;
}

export interface TokenResponse {
  token: string;
  expiresIn: number | string;
}