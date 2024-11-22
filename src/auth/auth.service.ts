import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/CreateUser.dto';
import { LoginUserDTO } from 'src/users/loginUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(private UsersService:UsersService,
                private jwtService:JwtService){}
                

    async authenticateLogin(loginCreds:LoginUserDTO){
        const user = await this.UsersService.getUserByEmail(loginCreds.email)
        if(user){
            const password_compare = await bcrypt.compare(loginCreds.password,user.password)
            if(password_compare){
                return await this.genToken(user)
            }
           
        }
        throw new UnauthorizedException()
    }            

    async genToken(user){
        const tokenPayload={
            id:user._id,
            role:user.role
        }

        const acessToken = await this.jwtService.signAsync(tokenPayload)

        return {acessToken, id:user._id, role:user.role}
    }

    async register(userData:CreateUserDTO){
        const user = await this.UsersService.getUserByEmail(userData.email)
        if(user){
            throw new ConflictException('A user with this email already exists.');
        }

        userData.password=await bcrypt.hash(userData.password,10)

        return await this.UsersService.register(userData)

    }




    






}
