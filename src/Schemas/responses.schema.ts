import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './users.schema'; 
import { Quiz } from './quizzes.schema';
import { QuestionBank } from './questionBank.schema';

export type ResponseDocument = HydratedDocument<Response>;

@Schema()
export class Response {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: mongoose.Schema.Types.ObjectId; // Reference to User schema

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true })
  quiz_id: mongoose.Schema.Types.ObjectId; // Reference to Quiz schema

  @Prop({
    type: [
      {
        question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', required: true },
        user_answer: { type: String, required: true },
        correct_answer: { type: String, required: true }, // Correct answer added here
      },
    ],
    required: true,
  })
  answers: { question_id: mongoose.Schema.Types.ObjectId; user_answer: string; correct_answer: string }[]; // List of answers with correct answers

  @Prop({ required: true })
  score: number; // Final score calculated based on correct answers

  @Prop({ required: true, default: Date.now })
  submitted_at: Date; // Timestamp for submission

  @Prop({required: true})
  message:string;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);