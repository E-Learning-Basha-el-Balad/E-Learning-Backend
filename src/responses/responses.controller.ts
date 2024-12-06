import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { createResponseDto } from './responsesDto/createResponse.dto';
import { updateResponseDto } from './responsesDto/updateResponse.dto';
import { Response } from '../Schemas/responses.schema';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  // Create a new response for a quiz
  @Post()
  async create(@Body() responseData: createResponseDto): Promise<Response> {
    return await this.responsesService.createResponse(responseData);
  }

  // Get a response by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response> {
    return await this.responsesService.findResponseById(id);
  }

  // Get all responses for a specific quiz
  @Get('quiz/:quiz_id')
  async findByQuiz(@Param('quiz_id') quiz_id: string): Promise<Response[]> {
    return await this.responsesService.findResponsesByQuiz(quiz_id);
  }

  // Get all responses for a specific user
  @Get('user/:user_id')
  async findByUser(@Param('user_id') user_id: string): Promise<Response[]> {
    return await this.responsesService.findResponsesByUser(user_id);
  }

  // Delete a response by ID
}
