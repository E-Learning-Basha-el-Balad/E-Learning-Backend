import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';


describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,//Providing the AuthService
        {
          provide: UsersService,//Mocking the UsersService
          useValue: {getUserByEmail:jest.fn()},//Mocking the getUserByEmail method
        },
        {
          provide: getModelToken('User'),//Mocking the User model
          useValue: {},//Mocking the User model
        },
        {
          provide: JwtService,//Mocking the JwtService
          useValue: {},//Mocking the JwtService
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);//Getting the instance of AuthController
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();//Ensuring that the controller is defined
  });
});
