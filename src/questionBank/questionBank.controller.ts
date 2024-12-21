import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { QuestionBankService } from './questionBank.service';
import { QuestionBank } from '../Schemas/QuestionBank.schema';
import { createQuestionsDTo } from './questionDto/createQuestionDto.dto';
import { updateQuestionsDTo } from './questionDto/updateQuestionDto.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('question-bank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  // Create a new question
  
  @Post()
  async createQuestion(@Body() questionData: createQuestionsDTo, @Req() req:any ): Promise<QuestionBank> {

    
    return await this.questionBankService.createQuestion(questionData);
  }

  // Get a specific question by ID
  @Get(':id')
  async getQuestionById(@Param('id') id: string): Promise<QuestionBank> {
    return await this.questionBankService.findById(id);
  }

  // Get all questions
  @Get()
  async getAllQuestions(): Promise<QuestionBank[]> {
    return await this.questionBankService.findAll();
  }

  // Update a question by ID
  @Put(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() updateData: updateQuestionsDTo,
  ): Promise<QuestionBank> {
    return await this.questionBankService.updateQuestion(id, updateData);
  }

  // Delete a question by ID
  @Delete(':id')
  async deleteQuestion(@Param('id') id: string): Promise<QuestionBank> {
    return await this.questionBankService.delete(id);
  }
}
