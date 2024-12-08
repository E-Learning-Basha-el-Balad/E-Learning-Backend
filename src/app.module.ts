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
import { DiscussionsModule } from './discussions/discussions.module';
import { CourseAnnouncementsModule } from './course-announcements/course-announcements.module';
import { PlatformAnnouncementsModule } from './platform-announcements/platform-announcements.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupService } from './backup/backup.service';
const uri:string="mongodb://localhost:27017/e-learning_db"



@Module({
  imports: [UserModule, CoursesModule, ModulesModule, QuizzesModule, ResponsesModule, ProgressModule,
  MongooseModule.forRoot('mongodb://localhost:27017/DiscussionForumV2 '),
  DiscussionsModule,
  CourseAnnouncementsModule,
  PlatformAnnouncementsModule,
  ],
  
  controllers: [AppController],
  providers: [AppService, BackupService],
})
export class AppModule {}
