import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './CreateUser.dto';
import { UsersService } from './users.service';
import {Role, User,UserDocument} from '../Schemas/users.schema'
import { LoginUserDTO } from './loginUser.dto';
import mongoose, { Model, ObjectId } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../role/role.decorator';
import { RolesGuard } from '../role/role.guard';

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

@Delete('deletemyself')
@UseGuards(AuthGuard, RolesGuard)  // Apply AuthGuard and RolesGuard
@Roles(Role.Student) // Allow Admin, Instructor, and Student roles
async DeleteMyself(@Req() req: any): Promise<User> {
  return await this.usersService.DeleteMyself(req.user.sub);
}
@Delete('deleteuser')
@UseGuards(AuthGuard, RolesGuard)  // Apply AuthGuard and RolesGuard
@Roles(Role.Admin)
async deleteUser(@Req() req: any,@Body('userId') userId: ObjectId): Promise<User> {
  return await this.usersService.deleteUser(req.user.sub,userId);
}
}
