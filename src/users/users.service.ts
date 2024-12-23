import { Injectable, UnauthorizedException,Logger,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../Schemas/users.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { CreateUserDTO} from './CreateUser.dto';
import { LoginUserDTO } from './loginUser.dto';
import { ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';

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
  async updateUserName(userId: Types.ObjectId, newName: string): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = newName;
    return user.save();
  }
  async getUserById(id:ObjectId):Promise<User>{
    const user = await this.userModel.findOne({_id:id})
    
    if (!user){  
       throw new NotFoundException('User not found');
    }
    user.password = null

    this.logger.log("User details fetched id:"+ user._id)
    
    return user
  }


  async getStudents(){
    return await this.userModel.find({role:"student"})
  }

  async getInstructors(){

    return await this.userModel.aggregate([
      {
        $match: { role: 'instructor' }  // Assuming 'role' field identifies instructors
      },
      {
        $lookup: {
          from: 'courses', // the collection to join with
          localField: '_id', // field in Users collection
          foreignField: 'userId', // field in Courses collection
          as: 'courses' // the name of the resulting array
        }
      }
    ]);

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



