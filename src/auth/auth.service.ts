import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CreateUserDTO } from 'src/users/CreateUser.dto';
import { LoginUserDTO } from 'src/users/loginUser.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LogsService } from '../logging/logs.service';

@Injectable()
export class AuthService {
    constructor(
        private UsersService: UsersService,
        private jwtService: JwtService,
        private logsService: LogsService
    ) {}

    async authenticateLogin(loginCreds: LoginUserDTO, res: Response) {
        const user = await this.UsersService.getUserByEmail(loginCreds.email);
        
        if (!user || !(await bcrypt.compare(loginCreds.password, user.password))) {
            await this.logsService.logFailedLogin(loginCreds.email);
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.genToken(user);
        res.cookie('jwt', token.accessToken, {
            httpOnly: true,//prevents xss
            secure: process.env.NODE_ENV === 'production', // secure cookies that are sent over https only for production and not for development
            maxAge: 24 * 60 * 60 * 1000,// 1000 ms = 1 second, 60 seconds = 1 minute, 60 minutes = 1 hour, 24 hours = 1 day
            sameSite: 'strict',//prevents csrf
        });
        
        return { id: user._id, role: user.role };
    }


    async genToken(user){
        const tokenPayload={
            sub: user._id,
            role:user.role
        }

        const accessToken = await this.jwtService.signAsync(tokenPayload)

        return {accessToken, id:user._id, role:user.role}

        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return { accessToken, id: user._id, role: user.role };

    }

    async register(userData: CreateUserDTO) {
        const existingUser = await this.UsersService.getUserByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('A user with this email already exists.');
        }
    
        const hashedPassword = await bcrypt.hash(userData.password, 12);
    
        const newUser = {
            ...userData, 
            password: hashedPassword,
        };
    
        return await this.UsersService.register(newUser);
    }
}
