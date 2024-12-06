import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionBankModule } from './questionBank/questionBank.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/Swdb'),
    ResponsesModule,
    QuizzesModule,
    QuestionBankModule,
    UserModule,
  ],
})
export class AppModule {}

