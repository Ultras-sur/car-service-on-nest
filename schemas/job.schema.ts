import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { JobCategory } from './job-category.schema';

export type JobDocument = Job & Document;

@Schema()
export class Job {

  @Prop({ required: true, unique: true })
  code: Number;

  @Prop({ required: true, unique: true })
  name: String;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'JobCategory', required: true })
  category: JobCategory;
}

export const JobSchema = SchemaFactory.createForClass(Job);