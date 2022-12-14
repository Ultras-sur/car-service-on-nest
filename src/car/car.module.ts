import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from '../../schemas/car.schema';
import { CarController } from './car.controller';
import { CarService } from '../car/car.service';
import { ClientModule } from '../client/client.module';
import { OrderModule } from '../order/order.module';
import { CarModelModule } from 'src/car-model/car-model.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]), forwardRef(() => ClientModule), forwardRef(() => OrderModule), CarModelModule],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})

export class CarModule { }