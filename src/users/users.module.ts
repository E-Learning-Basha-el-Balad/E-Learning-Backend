import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from 'src/Schemas/users.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [MongooseModule,UsersService] // Export MongooseModule to make UserSchema available
})
export class UserModule {}