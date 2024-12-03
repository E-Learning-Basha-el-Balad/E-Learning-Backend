import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { ModulesModule } from './modules/modules.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { ResponsesModule } from './responses/responses.module';
import { ProgressModule } from './progress/progress.module';
import { DiscussionsGateway } from './discussions/discussions.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionsService } from './discussions/discussions.service';
import { DiscussionsController } from './discussions/discussions.controller';
import { DiscussionsModule } from './discussions/discussions.module';

@Module({
  imports: [UserModule, CoursesModule, ModulesModule, QuizzesModule, ResponsesModule, ProgressModule,
  MongooseModule.forRoot('mongodb://localhost:27017/DiscussionForumV2 '),
  DiscussionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
