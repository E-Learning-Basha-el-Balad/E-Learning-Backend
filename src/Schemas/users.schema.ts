
//import { NestFactory } from '@nestjs/core';
import { Prop, Schema ,SchemaFactory} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
export type UserDocument = User & Document;
enum Role {
    Student = 'student',
    Instructor = 'instructor',
    Admin = 'admin',
  }
@Schema()
export class  User{

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

@Prop({required:true})
created_at: Date;  //ask if date.now or not

@Prop({required:true})
gpa: number;
=======
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  Student = 'student',
  Instructor = 'instructor',
  Admin = 'admin',
}

@Schema({ timestamps: true })
export class User {

  _id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: Role })
  role: Role;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Course', default: [] })
  enrolledCourses: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Course', default: [] })
  createdCourses: mongoose.Schema.Types.ObjectId[];

}

export const UserSchema = SchemaFactory.createForClass(User);
