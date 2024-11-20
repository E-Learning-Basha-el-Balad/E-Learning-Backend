import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, mongo } from 'mongoose';
import {Course} from './courses.schema';

export type ModuleDocument = Module & Document;

@Schema()
export class Module {
  @Prop({ required: true, unique: true })
  module_id: mongoose.Schema.Types.ObjectId; 

  @Prop({ type:mongoose.Schema.Types.ObjectId,required: true, ref: 'Course' })
  course_id: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  content: string; 

  @Prop({ required: false, type: [String] })
  resources: string[]; 

  @Prop({ required: true })
  created_at: Date; 
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
