import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response , Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDTO } from '../users/loginUser.dto';
import { CreateUserDTO } from '../users/CreateUser.dto';
import { AuthGuard } from './auth.guard'
import { request } from 'http';

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
    async register(@Body() userData:CreateUserDTO){
        return await this.AuthService.register(userData)
        
    }
    @UseGuards(AuthGuard)
    @Get('test')
    async test(@Req() req){
        return await req.user
    }

    
}
