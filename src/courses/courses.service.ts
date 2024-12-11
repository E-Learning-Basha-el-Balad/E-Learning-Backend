
import { Injectable, NotFoundException } from '@nestjs/common';
import { getModelToken, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../Schemas/courses.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { VersioningService } from './versioning/versioning.service';
import { User } from '../Schemas/users.schema';
import mongoose from 'mongoose';



@Injectable()
export class CoursesService {
  constructor(
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('User') private userModel: Model<User>,
    private readonly versioningService: VersioningService
  ) {}

  //Creating a new course
  async createCourse(createCourseDto: CreateCourseDto, instructorId: string): Promise<Course> {
    const newCourse = new this.courseModel({
      ...createCourseDto,
      instructorId,
      created_at: new Date(),
      versionNumber: 1,
    });
    return newCourse.save(); 
  }

// Enrolling a student in a course
async enrollStudent(courseId: string, studentId: string): Promise<Course> {
  const course = await this.courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundException(`Course with ID "${courseId}" not found`);
  }
  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  return this.courseModel.findByIdAndUpdate(
    courseId,
    { $addToSet: { students: studentObjectId } },
    { new: true }
  ).exec();
}

 //Updating a course
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    console.log('Updating course with ID:', id);
    console.log('Update data:', updateCourseDto);
    const courseId = new mongoose.Types.ObjectId(id);
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
      return this.courseModel.findByIdAndUpdate(
      courseId,
      { $set: updateCourseDto },
      { new: true }
    ).exec();
  }
  
  //Creating a new version for a course
  async createVersion(courseId: string, data: any): Promise<any> {
    return this.versioningService.createVersion(courseId, data);
  }
  
  //Retrieving all versions for a course
  async getVersions(courseId: string): Promise<any[]> {
    return this.versioningService.getVersions(courseId);
  }

//Retrieving a specific version for a course
  async getSpecificVersion(courseId: string, versionNumber: number): Promise<any> {
    return this.versioningService.getVersion(courseId, versionNumber);
  }

  //Searching for a course
  async searchCourses(query: any): Promise<Course[]> {
    const searchCriteria: any = {};
    if (query.title) {
      searchCriteria.title = { $regex: query.title, $options: 'i' };
    }
    if (query.category) {
      searchCriteria.category = query.category;
    }
    if (query.level) {
      searchCriteria.level = query.level;
    }
    return this.courseModel.find(searchCriteria).exec();
  }

// Retrieving all students by instructor
async getStudentsByInstructor(instructorId: string, courseId: string): Promise<User[]> {
  const course = await this.courseModel.findOne({
    _id: new mongoose.Types.ObjectId(courseId),
    instructorId: new mongoose.Types.ObjectId(instructorId)
  });
  if (!course) {
    throw new NotFoundException(`Course not found for instructor ${instructorId}`);
  }
  return this.userModel.find({ _id: { $in: course.students } }).exec();
}


// Retrieving all instructors by student and course
async getInstructorsByStudent(studentId: string, courseId: string): Promise<User[]> {
  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  if (!studentObjectId) {
    throw new NotFoundException(`Student with ID "${studentId}" not found`);
  }
const course = await this.courseModel.findOne({
    _id: new mongoose.Types.ObjectId(courseId),
    students: studentObjectId,
  }).exec();
  if (!course) {
    throw new NotFoundException(`No course found with ID "${courseId}" for the student with ID "${studentId}"`);
  }
  const instructor = await this.userModel.findById(course.instructorId.toString()).exec();
  if (!instructor) {
    throw new NotFoundException(`Instructor not found for course with ID "${courseId}"`);
  }
  return [instructor];
}

   //Retrieving a course by ID
  async getCourse(id: string): Promise<Course> {
    return this.courseModel.findById(id).exec();
  }

  //Retrieving all courses
  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  //Deleting a course by ID
  async deleteCourse(id: string): Promise<Course> {
    const result = await this.courseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Course not found');
    }
    return result;
  }
}
