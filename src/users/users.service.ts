import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDTO} from './CreateUser.dto';
import { LoginUserDTO } from './loginUser.dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async getUserByEmail(email:string):Promise<User | null>{
    const user = await this.userModel.findOne({email:email})
    
    if (!user){
      
      return null
    }
    
    return user
  }
  
  async register(userData: CreateUserDTO): Promise<UserDocument> {
    
      const newUser = new this.userModel(userData);
      return await newUser.save();
    }
  }



