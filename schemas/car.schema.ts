import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Client } from './client.schema';

export type CarDocument = Car & Document;

@Schema()
export class Car {
  @Prop({ required: true })
  brand: String;

  @Prop({ required: true })
  model: String;

  @Prop({ required: true })
  releaseYear: Number;

  @Prop({ required: true, unique: true })
  vin: String;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true })
  owner: Client;
}

export const CarSchema = SchemaFactory.createForClass(Car);