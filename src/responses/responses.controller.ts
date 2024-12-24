import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { createResponseDto } from './responsesDto/createResponse.dto';
import { updateResponseDto } from './responsesDto/updateResponse.dto';
import { Response } from '../Schemas/responses.schema';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';
import { Role } from '../Schemas/users.schema';


@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  // Create a new response for a quiz
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Student)
  @Post()
  async create(@Req() req:any,@Body() responseData: createResponseDto): Promise<Response> {
    return await this.responsesService.createResponse(req.user.sub,responseData);
  }

  // Get a response by ID
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Student)
  @Get(':id')
  async findOne(@Req() req:any,@Param('id') id: string): Promise<Response> {
    return await this.responsesService.findResponseById(req.user.sub,id);
  }

  // Get all responses for a specific quiz
  @Get('quiz/:quiz_id')
  async findByQuiz(@Param('quiz_id') quiz_id: string): Promise<Response[]> {
    return await this.responsesService.findResponsesByQuiz(quiz_id);
  }

  // Get all responses for a specific user
  @Get('user/responses')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  async findByUser(@Req() req: any): Promise<Response[]> {
    return await this.responsesService.findResponsesByUser(req.user.sub);
  }

  // Delete a response by ID
}
