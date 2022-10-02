import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ClientDocument = Client & Document;

@Schema()
export class Client {
  @Prop({ required: true })
  name: String;
  @Prop({ required: true, unique: true })
  licensNumber: Number;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

