import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { OrderServicePG } from './order.service';
import { OrderControllerPG } from './order.controller';
import { Order } from 'entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModulePG } from '../car/car.module';
import { ClientModulePG } from '../client/pg-client.module';
import { WorkPostModulePG } from '../workpost/pg-workpost.module';
import { JobModulePG } from '../job/pg-job.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CarModulePG,
    ClientModulePG,
    forwardRef(() => WorkPostModulePG),
    JobModulePG,
  ],
  providers: [OrderServicePG],
  controllers: [OrderControllerPG],
  exports: [OrderServicePG],
})
export class OrderModulePG {}
