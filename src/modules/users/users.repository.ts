import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonQuery } from '@typings/interfaces/api-response/commonQuery.interface';
import { RegisterUser } from '@typings/interfaces/users/registerUser.interface';

import { User, UserDocument } from './schemas/users.schemas';
import { CONSTANTS } from '@utils/constants';

export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>
  ) { }

  /**
   * Function to register user with given details.
   * @param createUserData
   */
  async registerUser(createUserData: RegisterUser) {
    const data = await this.usersModel.create({
      firstName: createUserData.firstName,
      lastName: createUserData.lastName,
      email: createUserData.email,
      password: createUserData.password,
    });
    return data;
  }

  /**
   * Function to retreive user details with custom query.
   * @param query
   */
  async getUserById(id: string): Promise<UserDocument> {
    return this.usersModel.findOne({ _id: id, isDeleted: false }, { trustedDevices: 0, createdAt: 0, updatedAt: 0, __v: 0, password: 0 });
  }


  /**
   * Function to retreive user details with custom query.
   * @param query
   */
  async getUserByQuery(query: CommonQuery): Promise<UserDocument> {
    const data = await this.usersModel.findOne(query);
    return data;
  }


  /**
   * Function to update user details with custom query.
   * @param userId
   * @param updateQuery
   */
  async updateUser(
    userId: string,
    updateQuery: any,
  ): Promise<UserDocument> {
    return this.usersModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userId),
        isDeleted: false,
      },
      updateQuery,
      {
        projection: {
          password: 0,
        },
        new: true,
      },
    );
  }

  /**
   * Function to retreive refresh token allowing sliding session ability for logged in user.
   * @param refreshToken - string
   */
  async getRefreshTokenByValue(refreshToken: string): Promise<UserDocument> {
    return this.usersModel.findOne({
      'trustedDevices.refreshToken': refreshToken,
      isDeleted: false,
    });
  }

  /**
   * Function to remove refresh token and restrict sliding session ability for logged out user.
   * @param refreshToken - string
   */
  async deleteTokenByValue(refreshToken: string): Promise<void> {
    await this.usersModel.updateMany(
      { 'trustedDevices.refreshToken': refreshToken, isDeleted: false },
      { $pop: { trustedDevices: 1 } },
    );
  }

  /**
   * Function to remove loggedin device details and handle multiple device trust functionality.
   * @param userId
   */
  async removeLogggedInDvcId(userId): Promise<void> {
    await this.usersModel.updateOne(
      { _id: userId, isDeleted: false },
      { $unset: { loggedInDvcId: 1 }, $pop: { trustedDevices: 1 } },
    );
  }

  /**
   * Function to soft delete user.
   * @param userId
   */
  async softDeleteUser(userId: string): Promise<void> {
    await this.usersModel.updateOne({ _id: userId, isDeleted: true });
  }

}
