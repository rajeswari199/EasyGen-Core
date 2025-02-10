import { JwtExpiry } from '@typings/interfaces/jwt/jwt.interface';

export class CONSTANTS {
  static get DB_CONN(): string {
    return 'easygen_app';
  }

  static get EMAIL_REGEX_PATTERN(): RegExp {
    return new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
  }

  static get PASSWORD_REGEX_PATTERN(): RegExp {
    return new RegExp(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/i,
    );
  }

  static get EXPIRATION_TIME(): number {
    return 60;
  }

  static get jwt(): JwtExpiry {
    return {
      ninetyDays: '90d',
      tenMinutes: 600,
    };
  }
}
