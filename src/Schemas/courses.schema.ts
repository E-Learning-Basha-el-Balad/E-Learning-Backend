import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CourseDocument = Course & Document;

enum DifficultyLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

@Schema({timestamps: true})
export class Course {
  @Prop({ required: true, unique: true })
  course_id: mongoose.Schema.Types.ObjectId; 

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

}

export const CourseSchema = SchemaFactory.createForClass(Course);
