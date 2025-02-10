import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { TrustedDevice } from '@typings/interfaces/users/userTrustedDevices.interface';


export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true, trim: true })
  firstName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;
 
  
  @Prop({ type: JSON, required: false })
  trustedDevices: TrustedDevice[];

  @Prop({ type: String, required: false })
  loggedInDvcId: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.set('timestamps', true);

userSchema.index({
  userName: 'text',
  firstName: 'text',
  lastName: 'text',
  email: 'text',
});

// Factory functions with pre, post, statics and methods for mongoose schema
export const userSchemaFactory = () => {
  const schema = userSchema;

  schema.pre('save', async function save(next) {
    try {
      if (!this.isModified('password')) return next();
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      return next();
    } catch (err) {
      return next(err);
    }
  });

  return schema;
};

export const usersModel = mongoose.model(User.name, userSchema);
