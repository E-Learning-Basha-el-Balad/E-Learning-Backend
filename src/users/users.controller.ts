import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDTO } from './CreateUser.dto';
import { UsersService } from './users.service';
import {User,UserDocument} from '../Schemas/users.schema'
import { LoginUserDTO } from './loginUser.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
@Get()
test(){
    return "hello World"
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
