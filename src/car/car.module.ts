import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from '../../schemas/car.schema';
import { CarController } from './car.controller';
import { CarService } from '../car/car.service';
import { ClientModule } from '../client/client.module';
import { OrderModule } from '../order/order.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]), forwardRef(() => ClientModule), forwardRef(() => OrderModule)],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})

export class CarModule { }