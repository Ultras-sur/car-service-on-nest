import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobCategoryDocument = JobCategory & Document;

@Schema()
export class JobCategory {
  
  @Prop({ required: true, unique: true })
  name: String;
}

export const JobCategorySchema = SchemaFactory.createForClass(JobCategory);