import { IsString, IsArray, IsNumber, IsNotEmpty, IsMongoId, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionBank } from 'src/Schemas/questionBank.schema';

export class createQuizzesDTo {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    module_id: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionBank)
    questionsA: QuestionBank[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionBank)
    questionsB: QuestionBank[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionBank)
    questionsC: QuestionBank[];

    @IsNumber()
    @IsNotEmpty()
    numOfQuestions: number;

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    @IsString({ each: true })
    typeOfQuestions: string[];
}
