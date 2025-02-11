import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import fs from 'fs/promises';
import { ApiBearerAuth, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { urlencoded, json } from 'express';

import { AppModule } from './app.module';
import { ConfigKey } from './config/configKeyMapping';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/middleware/exceptionFilter';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // For handling validation of input datas
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.setGlobalPrefix(configService.get(ConfigKey.BACKEND_PREFIX));
  app.enableVersioning();
  const documentFactory = await fs.readFile(join(process.cwd(), 'swagger/easyGenerator.json'), 'utf-8');
  let document = JSON.parse(documentFactory.toString())
  document = {
    ...new DocumentBuilder().addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token',
    }, 'access-token')
      .addSecurityRequirements('bearer')
      .build(), ...document
  }
  
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: (origin, callback) => {
      if (
        /**
         * whitelist urls for local testing and allow requests from web app, mobile app and other third party service urls
         */
        !configService.get('WHITELIST_URLS') ||
        configService.get('WHITELIST_URLS').includes(origin) ||
        configService.get('WHITELIST_URLS') === '*'
        || !origin
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,POST,PATCH,PUT,OPTIONS,DELETE',
  });

  await app.listen(configService.get(ConfigKey.PORT));
}

bootstrap();
