import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  
}