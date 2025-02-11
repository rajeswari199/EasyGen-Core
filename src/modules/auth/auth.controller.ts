import {
  Controller,
  UsePipes,
  Body,
  HttpStatus,
  ValidationPipe,
  HttpCode,
  Post,
  BadRequestException,
  UseGuards,
  Get,
  Query,
  NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

import { UserInfo } from '@typings/interfaces/users/userDetails.interface';
import { JWTPayload } from '@typings/interfaces/auth/jwt-payload.interface';
import { UserNotFoundException } from '@services/error.service';
import { SUCCESS } from '@messages/successMessages';
import { UsersService } from '@modules/users/users.service';
import { ERROR } from '@messages/errorMessages';
import { AuthGuard } from '@guards';
import { UserDocument } from '@modules/users/schemas/users.schemas';
import { User } from '@decorators/user.decorator';
import { CONSTANTS } from '@utils/constants';

import { LoginUserDto } from './dto/loginUser.dto';
import { RenewTokenDto } from './dto/renewToken.dto';
import { AuthService } from './auth.service';
import { ConfigKey } from '../../config/configKeyMapping';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginUserData: LoginUserDto) {
    let userDetails: UserDocument = null;

    if (loginUserData.email) {
      userDetails = await this.usersService.getUserByEmail(
        loginUserData.email,
      );
    }

    if (!userDetails) UserNotFoundException();

    const isPasswordMatches = await this.authService.checkPasswordMatches(
      loginUserData.password,
      userDetails.password,
    );

    if (!isPasswordMatches) {
      throw new BadRequestException(ERROR.USER.INVALID_EMAIL_OR_PASSWORD);
    }

    await this.usersService.updateUserDetails(userDetails._id, {
      loggedInDvcId: loginUserData.deviceId,
    });

    const response = {
      accessToken: await this.authService.createAccessToken(
        {
          userId: userDetails._id,
          loggedInDvcId: loginUserData.deviceId,
        },
        this.configService.get(ConfigKey.JWT_ACCESS_TOKEN_TTL) *
        CONSTANTS.EXPIRATION_TIME,
      )
    }


    return {
      message: SUCCESS.USER.LOGIN,
      data: response,
    };
  }

  @Post('logout')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async logout(
    @User() user: UserInfo,
    @Body('refreshToken') refreshToken?: string,
  ): Promise<{ message: string }> {
    await this.authService.logout(user._id, refreshToken);
    return { message: SUCCESS.USER.LOGOUT };
  }

  @Get('renewToken')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async renewAccessToken(@Query() queryParams: RenewTokenDto) {
    const tokenDetails = await this.usersService.getRefreshTokenByValue(
      queryParams.refreshToken,
    );
    if (!tokenDetails) {
      throw new NotFoundException(ERROR.TOKEN.NOT_FOUND);
    }
    const decodedRefreshToken: JWTPayload = verify(
      queryParams.refreshToken,
      this.configService.get(ConfigKey.JWT_SECRET_KEY),
    ) as JWTPayload;
    const newAccessToken = await this.authService.createAccessToken(
      {
        userId: decodedRefreshToken?.userId,
        loggedInDvcId: decodedRefreshToken?.loggedInDvcId,
      },
      this.configService.get(ConfigKey.JWT_ACCESS_TOKEN_TTL) *
      CONSTANTS.EXPIRATION_TIME,
    );
    const response = {
      statusCode: HttpStatus.OK,
      message: SUCCESS.AUTH.RENEW,
      data: {
        refreshToken: queryParams.refreshToken,
        accessToken: newAccessToken,
      },
    };
    return response;
  }

}
