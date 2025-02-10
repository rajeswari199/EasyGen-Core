import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';

import { UserDocument } from '@modules/users/schemas/users.schemas';
import { JWTPayload } from '@typings/interfaces/auth/jwt-payload.interface';
import { UsersService } from '@modules/users/users.service';
import { ERROR } from '@messages/errorMessages';

import { ConfigKey } from '../../config/configKeyMapping';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as any;
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    let user: UserDocument;
    if (accessToken) {
      try {
        const tokenDetails: JWTPayload = verify(
          accessToken,
          this.configService.get(ConfigKey.JWT_SECRET_KEY),
        ) as JWTPayload;

        user = await this.userService.getUserByDevice(
          tokenDetails.userId,
          tokenDetails.loggedInDvcId,
        );
      } catch (error) {
        throw new UnauthorizedException(ERROR.SESSION.EXPIRED);
      }
    }

    if (user) {
      if (user.isDeleted) {
        throw new NotFoundException(ERROR.USER.NOT_FOUND);
      }
      req.user = user;
    } else {
      throw new NotFoundException(ERROR.TOKEN.NOT_FOUND);
    }
    return true;
  }
}
