import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schemas/users.schema';
import { ModuleSchema } from 'src/Schemas/modules.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      
       { name: Module.name, schema: ModuleSchema },
    ]),
  ],
  providers: [ModulesService],
  controllers: [ModulesController]
})
export class ModulesModule {}
