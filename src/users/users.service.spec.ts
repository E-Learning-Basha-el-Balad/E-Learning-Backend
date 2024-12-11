import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../Schemas/users.schema';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, //Providing the UsersService
        {
          provide: getModelToken('User'),//Providing the User model token
          useValue: {
            Model,//Mocking the Model class
            new: jest.fn(),//Mocking the new method
            constructor: jest.fn(),//Mocking the constructor method
            find: jest.fn(),//Mocking the find method
            findById: jest.fn(),//Mocking the findById method
            create: jest.fn(),//Mocking the create method
            save: jest.fn(),//Mocking the save method
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);//Getting the instance of UsersService
    model = module.get<Model<User>>(getModelToken('User'));//Getting the instance of the User model
  });

  it('should be defined', () => {
    expect(service).toBeDefined();//Ensuring that the service is defined
  });
});
