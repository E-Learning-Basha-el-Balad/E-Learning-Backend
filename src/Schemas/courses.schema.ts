import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CourseDocument = Course & Document;

export enum DifficultyLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced'
}

@Schema({ timestamps: true })
export class Course {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: DifficultyLevel })
  level: DifficultyLevel;

  @Prop({ required: true })
  created_by: string;

  @Prop({ type: [Object], default: [] })
  versions: any[];

  @Prop({ required: true })
  versionNumber: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', required:true})
  userId:  mongoose.Types.ObjectId;
  
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
  students: mongoose.Types.ObjectId[];

  @Prop({ default: true })
  isAvailable: boolean;
  
  @Prop({default:true})
  keywords: string[]
    instructorId: any;
}
export const CourseSchema = SchemaFactory.createForClass(Course);