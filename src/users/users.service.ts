import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import { LoginUserDTO } from './loginUser.dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async register(userData: CreateUserDto): Promise<UserDocument> {
    const isRegistered = await this.userModel.findOne({ email: userData.email });
    if (isRegistered) {
      throw new ConflictException("User Already Registered");
    } else {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    }
  }

  async login(loginCreds:LoginUserDTO){
    const user = await this.userModel.findOne({email:loginCreds.email})

    if(!user){
        throw new UnauthorizedException("Invalid Email or Password")
    }

    if(user.password!=loginCreds.password){
        throw new 
    }

    return user
  }
}
