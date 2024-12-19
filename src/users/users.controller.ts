import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './CreateUser.dto';
import { UsersService } from './users.service';
import {User,UserDocument} from '../Schemas/users.schema'
import { LoginUserDTO } from './loginUser.dto';

import mongoose, { Model, ObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}





// @Post('login')
// async loginUser(@Body() LoginUserDTO:LoginUserDTO){
//     return this.usersService.login(LoginUserDTO)
// }
@Get('students')
async getStudents(){
    return this.usersService.getStudents()
}

// @Post('register')
// async registerUser(@Body() CreateUserDto:CreateUserDto):Promise<UserDocument>{
//     return this.usersService.register(CreateUserDto);

// }

}
