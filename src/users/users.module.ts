import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ModuleSchema } from 'src/Schemas/modules.schema';
import { QuestionBank, QuestionBankSchema } from 'src/Schemas/questionBank.schema';
import { Quiz, QuizSchema } from 'src/Schemas/quizzes.schema';
import { User, UserSchema } from 'src/Schemas/users.schema';
import { LogsModule } from 'src/logging/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),LogsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [MongooseModule,UsersService]
})
export class UserModule {}