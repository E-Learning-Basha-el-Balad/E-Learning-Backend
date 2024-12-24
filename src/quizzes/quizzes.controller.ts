import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { Quiz } from '../Schemas/quizzes.schema';
import { createQuizzesDTo } from './quizzesDto/createQuizzes.dto';
import { updateQuizzesDTo } from './quizzesDto/updateQuizzes.dto';
import { QuestionBank } from 'src/Schemas/questionBank.schema';
import { ObjectId } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/Schemas/users.schema';

@Controller('quizzes')
@UseGuards(AuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  // Create a new quiz
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor)
  @Post()
  async createQuiz(@Req() req:any,@Body() quizData: createQuizzesDTo): Promise<Quiz> {
    return await this.quizzesService.create(req.user.sub,quizData);
  }

  // Get all quizzes
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Student)
  @Get()
  async getAllQuizzes(@Req() req:any): Promise<Quiz[]> {
    return await this.quizzesService.findAll(req.user.sub);
  }

 // Get quizzes by user ID
 @Get(':user_id/:quiz_id')
 async getQuizQuestionsForUser(
   @Param('user_id') user_id: ObjectId,
   @Param('quiz_id') quiz_id: string
 ): Promise<QuestionBank[]> {
   return await this.quizzesService.findByUserId(user_id, quiz_id);
 }
 @UseGuards(AuthGuard,RolesGuard)
 @Roles(Role.Instructor,Role.Student)
 @Get('m/:module_id')
async getQuizByModuleId(@Req() req:any,@Param('module_id') module_id: string): Promise<Quiz> {
  return await this.quizzesService.findByModuleId(req.user.sub,module_id);
}



// Get a quiz by quiz ID
@Get(':quiz_id')  // Prefix with 'quiz'
async getQuizById(@Param('quiz_id') quiz_id: string): Promise<Quiz> {
  return await this.quizzesService.findByQuizId(quiz_id); // Call the service method to fetch by quiz_id
}


  // Update a quiz by ID
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor)
  @Put(':id')
  async updateQuiz(
    @Req() req:any,
    @Param('id') id: string,
    @Body() updateData: updateQuizzesDTo,
  ): Promise<Quiz> {
    return await this.quizzesService.update(req.user.sub,id, updateData);
  }

  // Delete a quiz by ID
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor)
  @Delete(':id')
  async deleteQuiz(@Req() req:any,@Param('id') id: string): Promise<Quiz> {
    return await this.quizzesService.delete(req.user.sub,id);
  }
}
