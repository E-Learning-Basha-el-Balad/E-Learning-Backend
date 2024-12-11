import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course,CourseSchema } from '../Schemas/courses.schema';
import { VersioningService } from './versioning/versioning.service';
import { User, UserSchema } from '../Schemas/users.schema';
import { UserModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      { name: 'User', schema: UserSchema },
    ]),
    UserModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService, VersioningService],
  exports: [CoursesService,MongooseModule],


})
export class CoursesModule {}