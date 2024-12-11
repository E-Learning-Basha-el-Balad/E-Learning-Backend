import { Injectable, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { Response, ResponseSchema } from '../Schemas/responses.schema';
import { Quiz, QuizSchema } from '../Schemas/quizzes.schema';
import { QuestionBank, QuestionBankSchema } from '../Schemas/questionBank.schema';
import { User, UserSchema } from '../Schemas/users.schema';
import { QuizzesService } from 'src/quizzes/quizzes.service';
import { ModuleSchema } from 'src/Schemas/modules.schema';

// Define QuizzesService here if it's tightly coupled

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Response.name, schema: ResponseSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: QuestionBank.name, schema: QuestionBankSchema },
      { name: User.name, schema: UserSchema },
      { name: 'Module', schema: ModuleSchema },
    ]),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService, QuizzesService], // Add QuizzesService here
})
export class ResponsesModule {}