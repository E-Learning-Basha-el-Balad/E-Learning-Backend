import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './gateways/chat.gateway';
import { Chat, ChatSchema } from '../Schemas/chat.schema';
import { Message, MessageSchema } from '../Schemas/message.schema';
import { User, UserSchema } from '../Schemas/users.schema';
import { LogsService } from 'src/logging/logs.service';
import { LogsModule } from 'src/logging/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([ 
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema }
    ]), LogsModule
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway]
})
export class ChatModule {}
