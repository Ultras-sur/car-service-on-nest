import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import flash = require('connect-flash');
import passport = require('passport');
import cookieParser = require('cookie-parser');
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

let app;

const PORT = process.env.PORT || 5000;
const logger = new Logger();

async function bootstrap() {
  app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const redisClient = createClient({
    socket: {
      port: configService.get('REDIS_PORT'),
      host: configService.get('REDIS_HOST'),
    },
  });
  redisClient.on('error', (error) => {
    logger.error('Redis in not connected: ' + error);
  });
  redisClient.on('connect', (error) => {
    logger.verbose('Redis is connected');
  });

  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.setBaseViewsDir(resolve('./views'));
  app.useStaticAssets(resolve('./public'));
  app.useStaticAssets(resolve('./public/car_images'));
  app.setViewEngine('pug');

  app.use(
    session({
      store: redisStore,
      secret: configService.get('SESSION_KEY'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  await redisClient.connect();
  await app.listen(PORT);
}
bootstrap();

export default app;
