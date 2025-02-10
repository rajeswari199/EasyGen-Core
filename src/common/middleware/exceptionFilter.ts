import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let httpErrorMessage = '';

    if (exception instanceof HttpException) {
      httpErrorMessage = exception.message || exception.name || exception.stack;
    }

    httpErrorMessage =
      exception['errorInfo']?.message ||
      (Array.isArray(exception['response']?.message)
        ? exception['response']['message'][0]
        : exception['response']?.message) ||
      (Array.isArray(exception['message'])
        ? exception['message'][0]
        : exception['message']) ||
      exception['error'] ||
      exception['error']?.message;

    const responseBody = {
      statusCode: httpStatus,
      message: httpErrorMessage,
    };

    if (exception['response']?.data) {
      responseBody['data'] = exception['response']['data'] || {};
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
