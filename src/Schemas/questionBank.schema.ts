import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Module } from './modules.schema';

export type QuestionBankDocument = HydratedDocument<QuestionBank>


@Schema()
export class QuestionBank {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
  module_id: Module; 

  @Prop({ required: true })
  question_text: string; 

  @Prop({ required: true })
  type: string; 

  @Prop({ type: [String], required: true })
  options: string[]; // Question options

  @Prop({ required: true })
  correct_answer: string; // Correct answer

  @Prop({required: true})
  difficulty: string;
}

export const QuestionBankSchema = SchemaFactory.createForClass(QuestionBank);
