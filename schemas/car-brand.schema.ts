import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CarBrandDocument = CarBrand & Document;

@Schema()
export class CarBrand {

  @Prop({ required: true, unique: true })
  name: String;
}

export const CarBrandSchema = SchemaFactory.createForClass(CarBrand);