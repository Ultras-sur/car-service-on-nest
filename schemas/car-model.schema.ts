import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CarBrand } from './car-brand.schema';

export type CarModelDocument = CarModel & Document;

@Schema()
export class CarModel {
  @Prop({ required: true, unique: true })
  name: String;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CarBrand', required: true })
  brand: CarBrand;
}

export const CarModelSchema = SchemaFactory.createForClass(CarModel);