import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './users.schema'; 
import { Quiz } from './quizzes.schema'; 

export type ResponseDocument = Response & Document;

@Schema()
export class Response {
  @Prop({ required: true, unique: true })
  response_id: mongoose.Schema.Types.ObjectId; 

  @Prop({ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  })
  user_id: mongoose.Schema.Types.ObjectId; 

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true})
  quiz_id: mongoose.Schema.Types.ObjectId; 

  @Prop({required: true}) 
  type : Object[];


  @Prop({ required: true })
  score: number; 

  @Prop({ required: true })
  submitted_at: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
