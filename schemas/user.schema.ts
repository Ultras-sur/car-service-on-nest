import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

export enum Role {
  USER = "user",
  MANAGER = "manager",
  ADMIN = "admin",
}

@Schema()

export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);