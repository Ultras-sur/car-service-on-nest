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
import { CarModelModulePG } from './postgres/car-model/car-model.module';
import { CarModulePG } from './postgres/car/car.module';
import { JobModulePG } from './postgres/job/pg-job.module';
import { OrderModulePG } from './postgres/order/order.module';
import { WorkPostModulePG } from './postgres/workpost/pg-workpost.module';
import { UserModulePG } from './postgres/user/pg-user.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_CONFIG, { useNewUrlParser: true }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
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
    CarModelModule,
    CarModelModulePG,
    CarModulePG,
    JobModulePG,
    OrderModulePG,
    WorkPostModulePG,
    UserModulePG,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
