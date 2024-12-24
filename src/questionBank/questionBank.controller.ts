import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { QuestionBankService } from './questionBank.service';
import { QuestionBank } from '../Schemas/QuestionBank.schema';
import { createQuestionsDTo } from './questionDto/createQuestionDto.dto';
import { updateQuestionsDTo } from './questionDto/updateQuestionDto.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/Schemas/users.schema';

@Controller('question-bank')
@UseGuards(AuthGuard)
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  // Create a new question
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor)
  @Post()
  async createQuestion(@Req() req:any, @Body() questionData: createQuestionsDTo ): Promise<QuestionBank> {
    return await this.questionBankService.createQuestion(req.user.sub,questionData);
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
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor)
  @Get('m/module/:module_id')
async getQuestionsByModuleId(@Req() req:any,@Param('module_id') module_id: string): Promise<QuestionBank[]> {
  return await this.questionBankService.findQuestionsByModuleId(req.user.sub,module_id);
}


  // Update a question by ID
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor)
  @Put(':id')
  async updateQuestion(
    @Req() req:any,
    @Param('id') id: string,
    @Body() updateData: updateQuestionsDTo,
  ): Promise<QuestionBank> {
    return await this.questionBankService.updateQuestion(req.user.sub,id, updateData);
  }

  // Delete a question by ID
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Instructor)
  @Delete(':id')
  async deleteQuestion(@Req() req:any,@Param('id') id: string): Promise<QuestionBank> {
    return await this.questionBankService.delete(req.user.sub,id);
  }
}
