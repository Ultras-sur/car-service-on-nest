import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarModule } from '../car/car.module';
import { JobModule } from '../job/job.module';
import { ClientModule } from '../client/client.module';
import { WorkPostModule } from '../workpost/workpost.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from '../../schemas/order.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  forwardRef(() => CarModule),
  forwardRef(() => ClientModule), 
             JobModule, 
             WorkPostModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule { }
