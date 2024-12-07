import { IsNotEmpty, IsString, IsEnum, IsDateString, IsArray } from 'class-validator';
import { DifficultyLevel } from '../../Schemas/courses.schema';

export class CreateCourseDto {
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
  @IsString()
  instructorId: string;

  @IsNotEmpty({ each: true })
  @IsArray()
  @IsString({ each: true })
  students: string[];


  @IsNotEmpty()
  @IsDateString()
  created_at: string;
}
