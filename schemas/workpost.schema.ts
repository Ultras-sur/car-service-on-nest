import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Car } from './car.schema';
import { Order } from './order.schema';

export type WorkPostDocument = WorkPost & Document;

@Schema()
export class WorkPost {
  @Prop({ required: true, unique: true })
  number: String;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Car' })
  car: Car;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order' })
  order: Order;
}

export const WorkPostSchema = SchemaFactory.createForClass(WorkPost);