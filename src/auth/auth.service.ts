import { ConflictException, Injectable, UnauthorizedException,Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CreateUserDTO } from 'src/users/CreateUser.dto';
import { LoginUserDTO } from 'src/users/loginUser.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LogsService } from '../logging/logs.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private UsersService: UsersService,
        private jwtService: JwtService,
        private logsService: LogsService
    ) {}

    async authenticateLogin(loginCreds: LoginUserDTO, res: Response) {
      try{
        const user = await this.UsersService.getUserByEmail(loginCreds.email);
        
        if (!user || !(await bcrypt.compare(loginCreds.password, user.password))) {
            await this.logsService.logFailedLogin(loginCreds.email);
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.genToken(user);
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: false, 
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: 'none',
      });

      this.logger.log(`User Logged successfully with ID: ${user._id}`);
      res.status(200).json({
        message: 'Login successful',
        userId: user._id,
    });
    }
      catch(err){

        this.logger.error(`Login Error: ${err.message}`);
        res.status(401).json({ message: 'Invalid credentials' });

      }
    }


    async genToken(user){
        const tokenPayload={
            sub: user._id,
            role:user.role
        }

        const accessToken = await this.jwtService.signAsync(tokenPayload)

        return {accessToken}


    }

    async register(userData: CreateUserDTO) {
        try {
          
          const existingUser = await this.UsersService.getUserByEmail(userData.email);
          if (existingUser) {
            throw new ConflictException('A user with this email already exists.');
          }
    
          
          const hashedPassword = await bcrypt.hash(userData.password, 12);
    
          
          const newUser = {
            ...userData,
            password: hashedPassword,
          };
    
    
          const user = await this.UsersService.register(newUser);
    
          
          this.logger.log(`User registered successfully with ID: ${user._id}`);
          
          
          return user;
        } catch (err) {
          
          this.logger.error('Error during user registration', err.stack);
    
          
          throw err;
        }
}
}
