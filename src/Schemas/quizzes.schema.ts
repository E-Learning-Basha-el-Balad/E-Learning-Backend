import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
  module_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank' }], required: true })
  questions: mongoose.Types.ObjectId[];

  @Prop({ required: true, default: Date.now })
  created_at: Date;

  @Prop({ type: [String], required: true })
  typeOfQuestions: string[];

  @Prop({ required: true })
  numOfQuestions: number;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);