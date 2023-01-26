import { Module } from '@nestjs/common';
import { OrderServicePG } from './order.service';
import { OrderControllerPG } from './order.controller';
import { Order } from 'entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderServicePG],
  controllers: [OrderControllerPG],
  exports: [OrderServicePG],
})
export class OrderModulePG {}
