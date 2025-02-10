import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CONSTANTS } from '@utils/constants';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import configuration from './config';
import { ConfigKey } from './config/configKeyMapping';

const AppMongooseConfig = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get(ConfigKey.MONGO_URI),
    useUnifiedTopology: true,
  }),
  connectionName: CONSTANTS.DB_CONN,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true
    }),
    MongooseModule.forRootAsync(AppMongooseConfig),
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
