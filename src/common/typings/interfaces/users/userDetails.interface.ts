import { ObjectId } from 'mongoose';
import { TokenResponse } from '@typings/interfaces/jwt/jwt.interface';


export interface UserInfo {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  loggedInDvcId?: string;
}

export interface UserExistQueryParams {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export interface UpdateUser {
  loggedInDvcId?: string;
}

export interface VerifiedUser {
  userId: string;
  isVerified: boolean;
  accessToken: TokenResponse;
  updatedAt: Date;
}

