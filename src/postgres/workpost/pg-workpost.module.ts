import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkPost } from '../../../entities/workpost.entity';
import { WorkPostServicePG } from './pg-workpost.service';
import { WorkPostControllerPG } from './pg-workpost.controller';
import { OrderModulePG } from '../order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkPost]),
    forwardRef(() => OrderModulePG),
  ],
  providers: [WorkPostServicePG],
  exports: [WorkPostServicePG],
  controllers: [WorkPostControllerPG],
})
export class WorkPostModulePG {}
