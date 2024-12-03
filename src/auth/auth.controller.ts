import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDTO } from '../users/loginUser.dto';
import { CreateUserDTO } from '../users/CreateUser.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly AuthService:AuthService){}

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() loginCreds: LoginUserDTO, @Res() res: Response) {
        const result = await this.AuthService.authenticateLogin(loginCreds, res);
        return res.json(result);
    }


    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() userData:CreateUserDTO){
        return this.AuthService.register(userData)
        
    }
    
}
