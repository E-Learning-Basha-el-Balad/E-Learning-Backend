import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionBankService } from './questionBank.service';
import { QuestionBankController } from './questionBank.controller';
import { QuestionBank, QuestionBankSchema } from '../Schemas/QuestionBank.schema';
import { ModuleSchema } from 'src/Schemas/modules.schema'; // Correctly import the ModuleSchema
import { LogsModule } from 'src/logging/logs.module';
import { User, UserSchema } from 'src/Schemas/users.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionBank.name, schema: QuestionBankSchema },
      { name: 'Module', schema: ModuleSchema },
      { name: User.name, schema: UserSchema },
    ]),LogsModule
  ],
  controllers: [QuestionBankController],
  providers: [QuestionBankService],
})
export class QuestionBankModule {}
