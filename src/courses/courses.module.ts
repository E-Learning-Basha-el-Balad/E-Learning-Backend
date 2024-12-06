import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course, CourseSchema } from 'src/Schemas/courses.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [MongooseModule], // Export MongooseModule to make CourseSchema available
})
export class CoursesModule {}