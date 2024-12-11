import { Body, Controller, Post, Get, UsePipes, ValidationPipe, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/CreateProgress.dto';


@Controller('progress')
export class ProgressController {
    constructor(private progressService: ProgressService) {}

    //////////////////////////////////////  STUDENT APIS //////////////////////////////////////

    @Post()
    @UsePipes(new ValidationPipe())
    createProgress(@Body() createProgressDto: CreateProgressDto) {
        console.log(createProgressDto);
        return this.progressService.createProgress(createProgressDto);
    }

    @Get('/averageCompletionPercentage')
    @UsePipes(new ValidationPipe())
    async getAvgCompletionPercentage(@Body('user_id') userId: string) {
        const average = await this.progressService.getAvgCompletionPercentage(userId);
        if(!average == null) {
            throw new HttpException('No records found for this user', HttpStatus.NOT_FOUND);
        }
        console.log(average);
        return average;
    }

    @Get('/courseId')
    @UsePipes(new ValidationPipe())
    async getCompletionPercentageByCourse(@Query('courseId') courseId: string, @Body() body: {studentId: string}) {
        console.log(courseId, body.studentId);
        const percentage = await this.progressService.getCompletionPercentageByCourse(body.studentId, courseId);
        if(!percentage == null) {
            throw new HttpException('No progress found for this course', HttpStatus.NOT_FOUND);
        } 
        console.log(percentage);
        return percentage;
    }

    @Get('/averageScores/student')
    @UsePipes(new ValidationPipe())
    async getAverageScoresAllCourses(@Body('studentId') studentId: string) {
        const averageScores = await this.progressService.getAverageScoresAllCourses(studentId);
        if(averageScores.length === 0) {
            throw new HttpException('No average scores found for this user', HttpStatus.NOT_FOUND);
        }
        return averageScores;
    }

    //get the number of quizzes that are left for the student to solve by course
    @Get('/engagement')
    @UsePipes(new ValidationPipe())
    async getEngagementTrend(@Query('courseId') courseId: string, @Body('studentId') studentId: string) {
        const engagement = await this.progressService.getEngagementTrend(studentId, courseId);
        if(engagement === null) {
            throw new HttpException('No engagement trends found for this user', HttpStatus.NOT_FOUND);
        }
        return engagement;
    }

    @Post('/rate-instructor')
    @UsePipes(new ValidationPipe())
    async rateInstructor(@Body('studentId') studentId: string, @Body('courseId') courseId: string, @Body('rating') rating: number) {
        return await this.progressService.rateInstructor(studentId, courseId, rating);
    }

    @Post('/rate-module')
    @UsePipes(new ValidationPipe())
    async rateModule(@Body('studentId') studentId: string, @Body('moduleId') moduleId: string, @Body('rating') rating: number) {
        return await this.progressService.rateModule(studentId, moduleId, rating);
    }

    @Get('/course-rating')
    @UsePipes(new ValidationPipe())
    async getCourseRatings(@Query('courseId') courseId: string) {
        const response = await this.progressService.getCourseRatings(courseId);
        if(response === null) {
            throw new HttpException("No ratings found for this course", HttpStatus.NOT_FOUND);
        }
        return response;
    }

    //////////////////////////////////////  INSTRUCTOR APIS //////////////////////////////////////

    @Get('averageScore/instructor')
    @UsePipes(new ValidationPipe())
    async getAverageScores(@Body('instructorId') instructorId: string){
        const engagements = await this.progressService.getAverageScores(instructorId);
        if(engagements.length === 0){
            throw new HttpException('No courses found', HttpStatus.NOT_FOUND);
        }
        return engagements;
    }

    @Get('/studentEngagementReport')
    @UsePipes(new ValidationPipe())
    async getStudentEngagementReport(@Query('courseId') courseId: string){
        const report = await this.progressService.getStudentEngagementReport(courseId);
        if(report === null){
            throw new HttpException('No report was found for this course', HttpStatus.NOT_FOUND);
        }
        return report;
    }

}
