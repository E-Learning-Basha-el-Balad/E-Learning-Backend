import { Injectable, UnauthorizedException,Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/users.schema';
import { Model } from 'mongoose';
import { CreateUserDTO} from './CreateUser.dto';
import { LoginUserDTO } from './loginUser.dto';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
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
    try{
      const newUser = new this.userModel(userData);

      const savedUser= await newUser.save();
      this.logger.log(`User registered successfully: ${savedUser._id}`)
      return savedUser
    }
    catch(err){
      this.logger.error('Error during user registration', err.stack);
      throw err;

    }
      
      
    }
  }



