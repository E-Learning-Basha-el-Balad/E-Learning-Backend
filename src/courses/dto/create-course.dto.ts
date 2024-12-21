import { IsNotEmpty, IsString, IsEnum, IsDateString, IsArray } from 'class-validator';
import { DifficultyLevel } from '../../Schemas/courses.schema';
import mongoose from 'mongoose';

export class CreateCourseDto {

  @IsNotEmpty()
  @IsString()
  userId: mongoose.Types.ObjectId;
    
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsEnum(DifficultyLevel)
  level: DifficultyLevel;

  @IsNotEmpty()
  @IsString()
  created_by: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  students: string[];

  @IsNotEmpty()
  @IsDateString()
  created_at: string;
}
