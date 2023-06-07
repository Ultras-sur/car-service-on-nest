import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception instanceof ForbiddenException) {
      console.log('Exeption: ' + exception);
      request.flash('loginError', 'You are not logged in!');
      return response.redirect('/login');
    } else if (exception instanceof UnauthorizedException) {
      console.log('Exeption: ' + exception);
      request.flash('loginError', 'Email or password is incorrect!');
      return response.redirect('/login');
    } else {
      console.log('Exeption: ' + exception);
      return response.redirect('/error');
    }
  }
}
