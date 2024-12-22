import { IsString, IsArray, IsNumber, IsNotEmpty } from 'class-validator';
import { QuestionBank } from 'src/Schemas/questionBank.schema';

export class createQuizzesDTo {
    @IsString()
    @IsNotEmpty()
    module_id: string;

    @IsArray()
    @IsNotEmpty({ each: true })
    questionsA: QuestionBank[];

    @IsArray()
    @IsNotEmpty({ each: true })
    questionsB: QuestionBank[];

    @IsArray()
    @IsNotEmpty({ each: true })
    questionsC: QuestionBank[];

    @IsNumber()
    numOfQuestions: number;

    @IsArray()
    @IsNotEmpty({ each: true })
    typeOfQuestions: string[];
}
