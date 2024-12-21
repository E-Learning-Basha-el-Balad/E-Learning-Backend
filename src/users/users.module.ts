import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ModuleSchema } from 'src/Schemas/modules.schema';
import { QuestionBank, QuestionBankSchema } from 'src/Schemas/questionBank.schema';
import { Quiz, QuizSchema } from 'src/Schemas/quizzes.schema';
import { User, UserSchema } from 'src/Schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [MongooseModule,UsersService]
})
export class UserModule {}