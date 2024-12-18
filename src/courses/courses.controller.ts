import { Controller, Get, Post, Body, Param, Put, Delete, Query,Req, Res, BadRequestException, NotFoundException , UseGuards } from '@nestjs/common';
import { VersioningService } from './versioning/versioning.service';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, DifficultyLevel } from '../Schemas/courses.schema';
import { User } from '../Schemas/users.schema';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { AuthGuard } from '../auth/auth.guard'

@Controller('courses')
export class CoursesController {
  constructor(
    private coursesService: CoursesService,
    private versioningService: VersioningService,
  ) {}


  

  @Post('create')
  async createCourse(@Body() createCourseDto: CreateCourseDto): Promise<any> {
    return this.coursesService.createCourse(createCourseDto);
  }

  @UseGuards(AuthGuard)
  @Post('/enroll')
  async enrollStudent(@Body() enrollDto: EnrollStudentDto, @Req() req: any) {
    const { courseId} = enrollDto;
    return await this.coursesService.enrollInCourse(courseId,req.user.sub);
  }

  @Get('Allcourses')
  async getAllCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }

  @Get('search')
  async searchCourses(@Body('title') title?: string,@Body('category') category?: string,@Body('level') level?: DifficultyLevel): Promise<Course[]> {
    return this.coursesService.searchCourses({ title, category, level });
  }

  @Get('instructor/:instructorId/:courseId/students')
  async getStudentsByInstructor(
    @Param('instructorId') instructorId: string,
    @Param('courseId') courseId: string
  ): Promise<User[]> {
    return this.coursesService.getStudentsByInstructor(instructorId, courseId);
  }

  @Get('students/:studentId/:courseId/instructors')
  async getInstructorsByStudent(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string
  ): Promise<User> {
    return this.coursesService.getInstructorByStudent(studentId, courseId);
  }

  @Get(':id')
  async getCourse(@Param('id') courseId: string): Promise<Course> {
    return this.coursesService.getCourse(courseId);
  }

  @Get('enrolled/:studentId')
  async getEnrolledCourses(@Param('studentId') studentId: string): Promise<Course[]> {
    return this.coursesService.getEnrolledCourses(studentId);
  }

  @Get('enrolled/student/:instructorId/:studentId')
  async getStudentEnrolledCourses(
    @Param('instructorId') instructorId: string,
    @Param('studentId') studentId: string
  ): Promise<Course[]> {
    return this.coursesService.getStudentEnrolledCourses(instructorId, studentId);
  }

  @Put(':id')
  async updateCourse(
    @Param('id') courseId: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Query('instructorId') instructorId: string
  ): Promise<Course> {
    return this.coursesService.updateCourse(courseId, updateCourseDto, instructorId);
  }

  @Delete('delete')
  async deleteCourse(
    @Body('courseId') courseId: string,
    @Body('instructorId') instructorId: string
  ): Promise<Course> {
    return this.coursesService.deleteCourse(courseId, instructorId);
  }
}
