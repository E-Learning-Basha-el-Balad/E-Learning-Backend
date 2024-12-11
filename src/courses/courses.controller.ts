import { Controller, Get, Post, Body, Param, Put, Delete, Query, BadRequestException } from '@nestjs/common';
import { VersioningService } from './versioning/versioning.service';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from '../Schemas/courses.schema';
import { User } from '../Schemas/users.schema';

@Controller('courses') 
//Define the base route for the courses
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly versioningService: VersioningService
  ) {}

//Creating a new course
@Post()
async createCourse(
  @Body() createCourseDto: CreateCourseDto,
  @Query('instructorId') instructorId: string
): Promise<Course> {
  if (!instructorId) {
    throw new BadRequestException('Instructor ID is required');
  }
  return this.coursesService.createCourse(createCourseDto, instructorId);
}

//Enrolling a student in a course
@Post(':id/enroll')
async enrollStudent(
  @Param('id') courseId: string,
  @Query('studentId') studentId: string
): Promise<Course> {
  return this.coursesService.enrollStudent(courseId, studentId);
}

//Creating a new version for a course
@Post(':id/versions')
async createVersion(
  @Param('id') id: string,
  @Body() data: any
): Promise<any> {
  return this.versioningService.createVersion(id, data);
}

//Retrieving a specific version for a course
@Get(':id/versions/:versionNumber')
async getSpecificVersion(
  @Param('id') id: string,
  @Param('versionNumber') versionNumber: string
): Promise<any> {
  return this.versioningService.getSpecificVersion(id, parseInt(versionNumber, 10));
}

//Searching for a course
@Get('search')
async searchCourses(
  @Query('title') title?: string,
  @Query('category') category?: string,
  @Query('level') level?: string
): Promise<Course[]> {
  return this.coursesService.searchCourses({ title, category, level });
}

// Retrieving all students by instructor
@Get('instructor/:instructorId/:courseId/students')
async getStudentsByInstructor(
  @Param('instructorId') instructorId: string,
  @Param('courseId') courseId: string
): Promise<User[]> {
  return this.coursesService.getStudentsByInstructor(instructorId, courseId);
}


// Retrieving all instructors by student and course
@Get('students/:studentId/:courseId/instructors')
async getInstructorsByStudent(
  @Param('studentId') studentId: string,
  @Param('courseId') courseId: string
): Promise<User[]> {
  return this.coursesService.getInstructorsByStudent(studentId, courseId);
}


//Updating a course
@Put(':id') 
async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<Course> {
  return this.coursesService.updateCourse(id, updateCourseDto);
  }

//Retrieving all versions for a course
@Get(':id/versions') 
async getAllVersions(@Param('id') id: string): Promise<any[]> {
  return await this.versioningService.getVersions(id);
  }

//Retrieving a course
@Get(':id') 
async getCourse(@Param('id') id: string): Promise<Course> {
  return this.coursesService.getCourse(id);
  }

//Retrieving all courses
@Get() 
async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

//Deleting a course
@Delete(':id') 
async deleteCourse(@Param('id') id: string): Promise<Course> {
  return this.coursesService.deleteCourse(id);
  }
}
