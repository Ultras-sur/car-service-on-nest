import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { resolve } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import flash = require('connect-flash');
import passport = require('passport');
import cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setBaseViewsDir(resolve('./views'));
  app.useStaticAssets(resolve('./public'));
  app.useStaticAssets(resolve('./public/car_images'));
  app.setViewEngine('pug');

  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  await app.listen(PORT);
}
bootstrap();
