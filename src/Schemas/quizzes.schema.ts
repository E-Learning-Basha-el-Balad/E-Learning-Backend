import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Module } from './modules.schema';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {
  @Prop({ required: true, unique: true })
  quiz_id: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true, ref:'Module', type: mongoose.Schema.Types.ObjectId })
  module_id: mongoose.Schema.Types.ObjectId; //references module id in modules so check it

  @Prop({ required: true })
  questions: Object[]; 

  @Prop({ required: true })
  created_at: Date; 
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
