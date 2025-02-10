import { ConfigService } from '@nestjs/config';
import { Inject, forwardRef } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { sign, verify } from 'jsonwebtoken';

import { TokenResponse } from '@typings/interfaces/jwt/jwt.interface';
import { JWTPayload } from '@typings/interfaces/auth/jwt-payload.interface';
import { ERROR } from '@messages/errorMessages';
import { ConfigKey } from '../../config/configKeyMapping';
import { UsersService } from '@modules/users/users.service';
import { CONSTANTS } from '@utils/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Function to check if password matches.
   * @param inputPassword
   * @param encryptedPassword
   */
  async checkPasswordMatches(
    inputPassword: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatch = await bcrypt.compare(
      inputPassword,
      encryptedPassword,
    );
    return isPasswordMatch;
  }

  /**
   * Function to create new access token.
   * @param payload
   * @param expiresAt
   */
  async createAccessToken(
    payload: JWTPayload,
    expiresAt: string | number = this.configService.get(
      ConfigKey.JWT_ACCESS_TOKEN_TTL,
    ) * CONSTANTS.EXPIRATION_TIME,
  ): Promise<TokenResponse> {
    const jwtId = uuid.v4();
    const jwtSecretKey = this.configService.get(ConfigKey.JWT_SECRET_KEY);

    const signedPayload = sign(payload, jwtSecretKey, {
      expiresIn: expiresAt,
      jwtid: jwtId,
    });

    return { token: signedPayload, expiresIn: Number(expiresAt) };
  }

  /**
   * Function to logout the user from current session.
   * @param userId
   * @param refreshToken
   */
  async logout(userId: string, refreshToken: string) {
    if (refreshToken) {
      const tokenDetails = await this.userService.getRefreshTokenByValue(
        refreshToken,
      );

      if (!tokenDetails) {
        throw new NotFoundException(ERROR.TOKEN.NOT_FOUND);
      }
    }
    await this.userService.removeLogggedInDvcId(userId);
  }

  /**
   * Function to decode the jwt token.
   * @param jwtToken
   */
  async decodeToken(jwtToken: string): Promise<JWTPayload> {
    const decodedToken = await verify(
      jwtToken,
      this.configService.get(ConfigKey.JWT_SECRET_KEY),
    ) as JWTPayload;
    return decodedToken;
  }

  /**
   * Function to encode the password.
   * @param password
   */
  async encodePassword(password: string): Promise<string> {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
