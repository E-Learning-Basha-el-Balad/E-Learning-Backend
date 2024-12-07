import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from '../users/loginUser.dto';
import { CreateUserDTO } from '../users/CreateUser.dto';

@Controller('auth')
export class AuthController {

    constructor(private AuthService:AuthService){}

    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() loginCreds:LoginUserDTO){ 
        return this.AuthService.authenticateLogin(loginCreds)
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    register(@Body() userData:CreateUserDTO){
        return this.AuthService.register(userData)
    }
    
}
