import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { resolve } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setBaseViewsDir(resolve('./views'));
  app.useStaticAssets(resolve('./public'));
  app.setViewEngine('pug');
  await app.listen(5000);
}
bootstrap();
