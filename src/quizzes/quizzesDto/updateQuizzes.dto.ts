import { IsString, IsArray, IsNumber, IsNotEmpty, IsOptional, ArrayMinSize, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionBank } from 'src/Schemas/questionBank.schema';

export class updateQuizzesDTo {
    @IsMongoId()
    module_id: string;
   
    @IsArray()
    @Type(() => QuestionBank)
    questionsA?: QuestionBank[];

    
    @IsArray()
    @Type(() => QuestionBank)
    questionsB?: QuestionBank[];

    
    @IsArray()
    @Type(() => QuestionBank)
    questionsC?: QuestionBank[];

    @IsNumber()
    @IsNotEmpty()
    numOfQuestions: number;

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    typeOfQuestions: string[];
}