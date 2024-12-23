import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './CreateUser.dto';
import { UsersService } from './users.service';
import { Role, User } from '../Schemas/users.schema';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('students')
  async getStudents() {
    return this.usersService.getStudents();
  }


  @Get('instructors')
  async getInstructors() {
    return this.usersService.getInstructors();
  }
@UseGuards(AuthGuard,RolesGuard)
@Roles(Role.Student, Role.Instructor)
  @Put(':id/name')
  async updateUserName(
    @Param('id') userId: string,
    @Body('name') newName: string,
  ): Promise<User> {
    const objectId = new Types.ObjectId(userId);
    return this.usersService.updateUserName(objectId, newName);
  }
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