import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database.module';
import { ClientModulePG } from './postgres/client/pg-client.module';
import { CarModelModulePG } from './postgres/car-model/car-model.module';
import { CarModulePG } from './postgres/car/car.module';
import { JobModulePG } from './postgres/job/pg-job.module';
import { OrderModulePG } from './postgres/order/order.module';
import { WorkPostModulePG } from './postgres/workpost/pg-workpost.module';
import { UserModulePG } from './postgres/user/pg-user.module';
import LogsMiddleware from 'middlewares/logs.middleware';
import { RedisModule } from './infrastructure/redis/redis.module';
import { TicketController } from './postgres/ticket/ticket.controller';
import { TicketService } from './postgres/ticket/ticket.service';
import { TicketModule } from './postgres/ticket/ticket.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SESSION_KEY: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    ClientModulePG,
    AuthModule,
    CarModelModulePG,
    CarModulePG,
    JobModulePG,
    OrderModulePG,
    WorkPostModulePG,
    UserModulePG,
    RedisModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
