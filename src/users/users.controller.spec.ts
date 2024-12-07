import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../Schemas/users.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);// Getting the instance of UsersController
    service = module.get<UsersService>(UsersService);// Getting the instance of UsersService
    model = module.get<Model<User>>(getModelToken('User'));// Getting the instance of the User model
  });

  it('should be defined', () => {
    expect(controller).toBeDefined(); // Ensuring that the controller is defined
  });
});
