import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Client } from './client.schema';
import { Car } from './car.schema';
import { Job } from './job.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ unique: true })
  number: String;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  workPost: String;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true })
  car: Car;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: Client;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true })
  jobs: [[Job, Number]];

  @Prop({ required: true, default: 'not confirm' })
  workStatus: String;

  @Prop({ required: true, default: 'opened' })
  orderStatus: String;

  @Prop()
  cost: Number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);