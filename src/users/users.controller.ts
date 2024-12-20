import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './CreateUser.dto';
import { UsersService } from './users.service';
import {User,UserDocument} from '../Schemas/users.schema'
import { LoginUserDTO } from './loginUser.dto';

import mongoose, { Model, ObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}



@Get('students')
async getStudents(){
    return this.usersService.getStudents()
}


@Get('instructors')
async getInstructors(){
    return this.usersService.getInstructors()
}
}
