import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { CarModule } from './car/car.module';
import { OrderModule } from './order/order.module';
import { WorkPostModule } from './workpost/workpost.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JobModule } from './job/job.module';
import { CarModelModule } from './car-model/car-model.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database.module';
import { ClientModulePG } from './postgres/client/pg-client.module';


@Module({
  imports: [MongooseModule.forRoot(process.env.DB_CONFIG, { useNewUrlParser: true }),
  ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST1: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
    })
  }),
    DatabaseModule,
    ClientModulePG,
    ClientModule,
    CarModule,
    OrderModule,
    WorkPostModule,
    UsersModule,
    AuthModule,
    JobModule,
    CarModelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


