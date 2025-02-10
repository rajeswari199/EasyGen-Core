
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CONSTANTS } from '@utils/constants';
import { USERS } from '@schemas';

import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';

import { AuthModule } from '@modules/auth/auth.module';

const Schemas = [USERS];

@Module({
  imports: [
    MongooseModule.forFeatureAsync(Schemas, CONSTANTS.DB_CONN),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
