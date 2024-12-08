//import { NestFactory } from '@nestjs/core';
import { Prop, Schema ,SchemaFactory} from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

export enum Role {
    Student = 'student',
    Instructor = 'instructor',
    Admin = 'admin',
  }

@Schema({timestamps:true})
export class  User{
@Prop({required:true})
name: string;

@Prop({required:true})
email: string;

@Prop({required:true})
password: string;

@Prop({ required: true, enum: Role })
role: Role;


}

export const UserSchema = SchemaFactory.createForClass(User);