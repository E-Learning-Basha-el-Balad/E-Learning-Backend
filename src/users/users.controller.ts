import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './CreateUser.dto';
import { UsersService } from './users.service';
import {User,UserDocument} from '../Schemas/users.schema'
import { LoginUserDTO } from './loginUser.dto';

import mongoose, { Model, ObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

@Get('name/:id')
async getName(@Param() id:any){
    const name = this.usersService.getUserNamebyID(id)

    if(!name){
        throw new UnauthorizedException("USER DOES NOT EXIST")
    }

    return name

}



// @Post('login')
// async loginUser(@Body() LoginUserDTO:LoginUserDTO){
//     return this.usersService.login(LoginUserDTO)
// }


// @Post('register')
// async registerUser(@Body() CreateUserDto:CreateUserDto):Promise<UserDocument>{
//     return this.usersService.register(CreateUserDto);

// }

}
