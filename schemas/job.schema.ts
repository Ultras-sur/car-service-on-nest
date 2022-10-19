import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema()
export class Job {
  
  @Prop({ required: true, unique: true })
  code: Number;

  @Prop({ required: true, unique: true })
  name: String;
}

export const JobsSchema = SchemaFactory.createForClass(Job);