import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkPostService } from './workpost.service';
import { CarModule } from '../car/car.module';
import { OrderModule } from '../order/order.module';
import { WorkPostController } from './workpost.controller';
import { WorkPost, WorkPostSchema } from '../../schemas/workpost.schema';
import { RolesGuard } from '../auth/common/guards/roles.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: WorkPost.name, schema: WorkPostSchema }]), forwardRef(() => CarModule), forwardRef(() => OrderModule)],
  providers: [WorkPostService],
  controllers: [WorkPostController],
  exports: [WorkPostService],
})
export class WorkPostModule { }
