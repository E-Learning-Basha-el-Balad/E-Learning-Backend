import { IsMongoId, IsNotEmpty, IsString } from "class-validator";


export class CreateAnnouncementDto{
    
    @IsNotEmpty()
    @IsString()
    content: string;
    
    @IsNotEmpty()
    @IsMongoId()
    instructor: string;
    
    @IsNotEmpty()
    @IsMongoId()
    course: string;

}