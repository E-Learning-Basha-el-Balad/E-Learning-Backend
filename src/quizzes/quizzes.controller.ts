import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { Quiz } from '../Schemas/quizzes.schema';
import { createQuizzesDTo } from './quizzesDto/createQuizzes.dto';
import { updateQuizzesDTo } from './quizzesDto/updateQuizzes.dto';
import { QuestionBank } from 'src/Schemas/questionBank.schema';
import { ObjectId } from 'mongoose';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  // Create a new quiz
  @Post()
  async createQuiz(@Body() quizData: createQuizzesDTo): Promise<Quiz> {
    return await this.quizzesService.create(quizData);
  }

  // Get all quizzes
  @Get()
  async getAllQuizzes(): Promise<Quiz[]> {
    return await this.quizzesService.findAll();
  }

 // Get quizzes by user ID
 @Get(':user_id/:quiz_id')
 async getQuizQuestionsForUser(
   @Param('user_id') user_id: ObjectId,
   @Param('quiz_id') quiz_id: string
 ): Promise<QuestionBank[]> {
   return await this.quizzesService.findByUserId(user_id, quiz_id);
 }


// Get a quiz by quiz ID
@Get(':quiz_id')  // Prefix with 'quiz'
async getQuizById(@Param('quiz_id') quiz_id: string): Promise<Quiz> {
  return await this.quizzesService.findByQuizId(quiz_id); // Call the service method to fetch by quiz_id
}


  // Update a quiz by ID
  @Put(':id')
  async updateQuiz(
    @Param('id') id: string,
    @Body() updateData: updateQuizzesDTo,
  ): Promise<Quiz> {
    return await this.quizzesService.update(id, updateData);
  }

  // Delete a quiz by ID
  @Delete(':id')
  async deleteQuiz(@Param('id') id: string): Promise<Quiz> {
    return await this.quizzesService.delete(id);
  }
}
