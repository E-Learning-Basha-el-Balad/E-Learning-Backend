import { IsString, IsArray, IsNumber, IsNotEmpty } from 'class-validator';
import { QuestionBank } from 'src/Schemas/questionBank.schema';

export class updateQuizzesDTo {
    @IsString()
    @IsNotEmpty()
    module_id: string;

    @IsArray()
    @IsNotEmpty({ each: true })
    questions: QuestionBank[];

    @IsNumber()
    numOfQuestions: number;

    @IsArray()
    @IsNotEmpty({ each: true })
    typeOfQuestions: string[];
}