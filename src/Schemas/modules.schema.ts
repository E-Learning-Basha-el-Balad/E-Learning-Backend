import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, mongo } from 'mongoose';
import {Course} from './courses.schema';

export type ModuleDocument = HydratedDocument<Module>;

@Schema()
export class Module {
  
  @Prop({ type:mongoose.Schema.Types.ObjectId,required: false, ref: 'Course' })
  course_id: mongoose.Schema.Types.ObjectId; 

  @Prop({ required: true })
  title: string; 

  @Prop({ required: false })
  content: string; 

  @Prop({ required: false, type: [String] })
  resources: string[]; 

  @Prop({ required: false })
  created_at: Date; 
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
