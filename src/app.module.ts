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
import { CarModelService } from './car-model/car-model.service';
import { CarModelController } from './car-model/car-model.controller';
import { CarModelModule } from './car-model/car-model.module';


@Module({
  imports: [MongooseModule.forRoot(process.env.DB_CONFIG, { useNewUrlParser: true }),
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


