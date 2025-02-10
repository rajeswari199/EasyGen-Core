import { Types } from 'mongoose';

export interface CommonQuery {
  _id?: Types.ObjectId;
  email?: string;
  isDeleted?: boolean;
  loggedInDvcId?: string;
}

