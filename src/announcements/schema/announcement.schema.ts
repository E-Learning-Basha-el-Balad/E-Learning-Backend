import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import exp from "constants";
import mongoose from "mongoose";
import { Course } from "src/Schemas/courses.schema";
import { User } from "src/Schemas/users.schema";


export type AnnouncementDocument = Announcement & Document;

@Schema({ timestamps: true })
export class Announcement {
    
    @Prop({required : true})
    content: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
    instructor: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
    course: Course;

}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);

