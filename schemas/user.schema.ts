import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

export enum Role {
  USER = "USER",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

@Schema()

export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ default: 'User' })
  name: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);