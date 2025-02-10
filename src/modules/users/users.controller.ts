import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Delete,
  BadRequestException
} from '@nestjs/common';

import { UserInfo } from '@typings/interfaces/users/userDetails.interface';
import {
  Response,
  IsUserExistResponse,
} from '@typings/interfaces/api-response/apiResponse.interface';
import { AuthGuard } from '@guards';
import { SUCCESS } from '@messages/successMessages';
import { ERROR } from '@messages/errorMessages';
import { TrimPipe } from '@pipes/trim.pipe';
import { User } from '@decorators/user.decorator';

import { UsersService } from './users.service';
import {
  RegisterUserDto,
  IsUserExistDto,
  VerifyUserParamDto
} from './dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @UsePipes(new TrimPipe(), new ValidationPipe({ whitelist: true }))
  async validateNewUser(@Body() user: RegisterUserDto): Promise<Response<null>> {
    await this.usersService.registerNewUser(user);

    return {
      message: SUCCESS.USER.REGISTER,
      data: null,
    };
  }

  @Get('isExist')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async doesUserExist(
    @Query() data: IsUserExistDto,
  ): Promise<Response<IsUserExistResponse>> {
    const isUserExist = await this.usersService.doesUserExist({
      ...data,
      isDeleted: false,
    });
    const responseData = {
      message: `${Object.keys(data)[0]} ${SUCCESS.USER.AVAILABLE}`,
    };
    if (isUserExist) {
      responseData['message'] = ERROR.USER.EMAIL_EXISTS;
    }
    return { message: responseData.message, data: { isUserExist } };
  }

  @Get('')
  @UseGuards(AuthGuard)
  async userDetails(@User() user): Promise<Response<UserInfo>> {
    const data = await this.usersService.getUserById(user._id);

    return { data };
  }

  @Delete('/:userId')
  @UseGuards(AuthGuard)
  async removeUser(
    @Param() { userId }: VerifyUserParamDto,
    @User() user: UserInfo,
  ): Promise<Response<null>> {
    if (user._id.toString() === userId) {
      throw new BadRequestException(ERROR.USER.REMOVE_NOT_ALLOWED);
    }
    await this.usersService.removeUser(userId);

    return {
      message: SUCCESS.USER.REMOVED,
      data: null,
    };
  }
}
