import { IsMongoId, IsNotEmpty, IsString } from "class-validator";


export class CreateAnnouncementDto{
    
    @IsNotEmpty()
    @IsString()
    content: string;
    
    @IsNotEmpty()
    @IsMongoId()
    instructer: string;
    
    @IsNotEmpty()
    @IsMongoId()
    course: string;

}