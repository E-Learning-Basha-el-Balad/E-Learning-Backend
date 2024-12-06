//import { NestFactory } from '@nestjs/core';
import { Prop, Schema ,SchemaFactory} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
export type UserDocument = User & Document;
enum Role {
    Student = 'student',
    Instructor = 'instructor',
    Admin = 'admin',
  }
@Schema({timestamps:true})
export class  User{
@Prop({required:true, unique:true})
user_id: mongoose.Schema.Types.ObjectId;

@Prop({required:true})
name: string;

@Prop({required:true, unique:true})
email: string;

@Prop({required:true})
password_hash: string; //hashed password

@Prop({ required: true, enum: Role })
role: Role;

@Prop({required:false})
profile_picture_url: string;

}

export const UserSchema = SchemaFactory.createForClass(User);