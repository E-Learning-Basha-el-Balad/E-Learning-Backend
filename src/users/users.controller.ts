import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './CreateUser.dto';
import { UsersService } from './users.service';
import { Role, User } from '../Schemas/users.schema';
import { mongo, ObjectId, Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  async getStudents() {
    return this.usersService.getStudents();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Instructor,Role.Student, Role.Admin)
  @Get()
  async getMe(userId:ObjectId): Promise<User> {
    return await this.usersService.getUser(userId);
  }
  @Get('instructors')
  async getInstructors() {
    return this.usersService.getInstructors();
  }
@UseGuards(RolesGuard)
@Roles(Role.Student, Role.Instructor)
@Put('/editname')
  async updateUserName(
    @Body('name') newName: string, @Req() req: any
  ): Promise<User> {
    const objectId = new Types.ObjectId(req.user.sub);
    return this.usersService.updateUserName(objectId, newName);
  }
@UseGuards(RolesGuard)
@Roles(Role.Student)
  @Delete('deletemyself')
async DeleteMyself(@Req() req: any): Promise<User> {
  return await this.usersService.DeleteMyself(req.user.sub);
}

@Delete('deleteuser')
@UseGuards(RolesGuard)  // Apply AuthGuard and RolesGuard
@Roles(Role.Admin)
async deleteUser(@Req() req: any,@Body('userId') userId: ObjectId): Promise<User> {
  const user = await this.usersService.getUserById(userId);
  // if(user.setActive==false){
  //   throw new UnauthorizedException('User is already deleted')
  // }
  return await this.usersService.deleteUser(req.user.sub,userId);
}
}
