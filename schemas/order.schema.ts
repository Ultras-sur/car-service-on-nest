import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Client } from './client.schema';
import { Car } from './car.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ unique: true })
  number: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  workPost: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true })
  car: Car;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  client: Client;

  @Prop()
  jobs: [[{ type: mongoose.Schema.Types.ObjectId; ref: 'Job' }, number]];

  @Prop({ required: true, default: 'opened' })
  orderStatus: string;

  @Prop()
  cost: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
