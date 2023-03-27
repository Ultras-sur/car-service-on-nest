import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { Car } from 'entities/car.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarServicePG } from './car.service';
import { CarControllerPG } from './car.controller';
import { CarModelModulePG } from '../car-model/car-model.module';
import { ClientModulePG } from '../client/pg-client.module';
import { OrderModulePG } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]),
    CarModelModulePG,
    forwardRef(() => ClientModulePG),
    OrderModulePG,
  ],
  providers: [CarServicePG],
  controllers: [CarControllerPG],
  exports: [CarServicePG],
})
export class CarModulePG {}
