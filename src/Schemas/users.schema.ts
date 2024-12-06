//import { NestFactory } from '@nestjs/core';
import { Prop, Schema ,SchemaFactory} from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;


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

@Prop({required:false})
password_hash: string; //hashed password

@Prop({ required: false, enum: Role })
role: Role;

@Prop({required:false})
profile_picture_url: string;

@Prop({required:true})
gpa: number;

@Prop({required:false})
created_at: Date;  //ask if date.now or not
}

export const UserSchema = SchemaFactory.createForClass(User);