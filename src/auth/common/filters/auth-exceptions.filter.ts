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
    console.log(exception);
    if (exception instanceof UnauthorizedException) {
      request.flash('loginError', 'Email or password is incorrect!');
      return response.redirect('/login');
    } else if (exception instanceof ForbiddenException) {
      request.flash('loginError', 'You are not logged in!');
      return response.redirect('/login');
    } else {
      return response.redirect('/error');
    }
  }
}  