import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema()

export class User {
  @Prop({ unique: true, required: true })
  email: String;

  @Prop()
  password: String;

  @Prop({ required: true })
  roles: [String];
}

export const UserSchema = SchemaFactory.createForClass(User);