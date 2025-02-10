import { Injectable } from '@nestjs/common';
import { Types, ObjectId } from 'mongoose';
import { TokenResponse } from '@typings/interfaces/jwt/jwt.interface';

import {
  UserNotFoundException,
} from '@services/error.service';
import { UpdateUser } from '@typings/interfaces/users/userDetails.interface';
import { RegisterUser } from '@typings/interfaces/users/registerUser.interface';
import { CONSTANTS } from '@utils/constants';
import { AuthService } from '@modules/auth/auth.service';
import { TrustedDevice } from '@typings/interfaces/users/userTrustedDevices.interface';

import { UsersRepository } from './users.repository';
import { UserDocument } from './schemas/users.schemas';
import { DeviceTrustDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) { }

  /**
   * Function to register new user.
   * @param userData
   */
  async registerNewUser(userData: RegisterUser): Promise<UserDocument> {
    const registeredUser = await this.usersRepository.registerUser({
      ...userData
    });

    return registeredUser;
  }

  /**
   * Function to fetch user details by id.
   * @param userData
   */
  async getUserById(id: string): Promise<UserDocument> {
    const userDetails = await this.usersRepository.getUserById(id);
    if (!userDetails) UserNotFoundException();

    return userDetails;
  }

  /**
   * Function to check if user exists.
   * @param data
   */
  async doesUserExist(data: object): Promise<boolean> {
    const isUserExist = await this.usersRepository.getUserByQuery(data);
    return !!isUserExist;
  }

  /**
   * Function to retreive user details by email.
   * @param email
   */
  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.usersRepository.getUserByQuery({
      email,
      isDeleted: false,
    });

    if (!user) return null;

    return user;
  }

  /**
  * Function to retreive user details by loggedin device id.
  * @param userId
  * @param loggedInDvcId
  */
  async getUserByDevice(
    userId: string,
    loggedInDvcId: string,
  ): Promise<UserDocument> {
    const userData = await this.usersRepository.getUserByQuery({
      _id: new Types.ObjectId(userId),
      loggedInDvcId,
    });
    if (!userData) {
      UserNotFoundException();
    }
    return userData;
  }

  /**
   * Function to retreive user details by custom query.
   * @param userId
   */
  async getUserDetails(userId: string): Promise<UserDocument> {
    const userData = await this.usersRepository.getUserByQuery({
      _id: new Types.ObjectId(userId),
      isDeleted: false,
    });
    if (!userData) {
      UserNotFoundException();
    }
    return userData;
  }

  /**
   * Function to save the user logged in trusted devices for enabling sliding session.
   * @param loggedInUserId
   * @param deviceTrust
   */
  async saveTrustedDevice(
    trustedDevice: DeviceTrustDto,
    loggedInUserId: string,
  ): Promise<{ refreshToken: TokenResponse }> {
    const { deviceId } = trustedDevice;

    const expiresIn = CONSTANTS.jwt.ninetyDays; // 90 day expiry for refresh token
    const refreshToken = await this.authService.createAccessToken(
      {
        userId: loggedInUserId,
        loggedInDvcId: trustedDevice.deviceId,
      },
      expiresIn,
    );
    const device: TrustedDevice = {
      deviceId,
      refreshToken: refreshToken.token,
    };
    const updateObj = {
      trustedDevices: [device],
      updatedAt: new Date(),
    };

    await this.usersRepository.updateUser(loggedInUserId, updateObj);

    return {
      refreshToken,
    };
  }

  /**
   * Function to retreive refresh token allowing sliding session ability for logged in user.
   * @param refreshToken - string
   */
  async getRefreshTokenByValue(refreshToken: string) {
    return this.usersRepository.getRefreshTokenByValue(refreshToken);
  }

  /**
   * Function to remove refresh token and restrict sliding session ability for logged out user.
   * @param refreshToken - string
   */
  async deleteTokenByValue(refreshToken: string) {
    return this.usersRepository.deleteTokenByValue(refreshToken);
  }

  /**
   * Function to remove loggedin device details and handle multiple device trust functionality.
   * @param userId
   */
  async removeLogggedInDvcId(userId: string | ObjectId) {
    return this.usersRepository.removeLogggedInDvcId(userId);
  }


  /**
   * Function to update user details with custom query.
   * @param userId
   * @param updateObj
   */
  async updateUserDetails(
    userId: string,
    updateObj: UpdateUser,
  ): Promise<UserDocument> {
    let updateParams = updateObj;
    return this.usersRepository.updateUser(userId, updateParams);
  }

  /**
   * Function to remove user.
   * @param userId
   */
  async removeUser(userId: string): Promise<null> {
    await this.getUserById(userId);
    await this.usersRepository.softDeleteUser(userId);
    return null;
  }

}
