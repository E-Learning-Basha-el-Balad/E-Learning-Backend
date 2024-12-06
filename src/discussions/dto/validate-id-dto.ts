import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ValidateIdDto {
    @IsMongoId()
    id: string;
}