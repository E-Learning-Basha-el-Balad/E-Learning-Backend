import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ValidateIdDto {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id: string;
}