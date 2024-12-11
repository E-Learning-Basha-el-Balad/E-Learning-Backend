import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  studentId: string; // Reference to the user

  @Prop({ required: true })
  moduleId: string; // Reference to the module
}

export const NoteSchema = SchemaFactory.createForClass(Note);
