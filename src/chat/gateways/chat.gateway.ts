import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Socket, Server } from 'socket.io';
import { MessageDto } from '../dto/message.dto';
import { ChatService } from "../chat.service";
import { Message } from "src/Schemas/message.schema";
import { GroupChatDto } from "../dto/groupchat.dto";
import { group } from "console";
import { UseGuards } from "@nestjs/common";
//import { AuthGuard } from "@nestjs/passport";
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard } from '../../role/role.guard';
import { Roles } from '../../role/role.decorator';
import { Role } from '../../Schemas/users.schema';
import mongoose from "mongoose";

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server : Server;

    constructor(private readonly chatService : ChatService) {}
    
    handleConnection(client: Socket) {
        client.broadcast.emit('user-connected', {
            message: `New user connected ${client.id}`
        });
    }

    handleDisconnect(client: Socket) {
        this.server.emit('user-disconnected', {
            message: `User disconnected ${client.id}`
        });
    }

    @Roles(Role.Student, Role.Instructor)
    @UseGuards(AuthGuard, RolesGuard)
    @SubscribeMessage('newMessage')
    async handleNewMessage(@MessageBody() message : MessageDto){
        const success : unknown = await this.chatService.createMessage(message);

        this.server.emit('message-reply', success);
    }
    
    @Roles(Role.Student, Role.Instructor)
    @UseGuards(AuthGuard, RolesGuard)
    @SubscribeMessage('getChat')
    async handelGetChat(client : Socket, @MessageBody() chat : any){
        try{
            const history = await this.chatService.getChat(chat);
            this.server.emit('get-chat-reply', history);
        }
        catch(err){
            console.log("Internal Server Error");
        }
    }

    @Roles(Role.Student, Role.Instructor)
    @UseGuards(AuthGuard, RolesGuard)
    @SubscribeMessage('createGroup')
    async handleCreateGroup(client : Socket, groupChatDto : GroupChatDto){
        try{
            
            const success = await this.chatService.createGroup(groupChatDto);
            
            this.server.emit('create-group-reply', success);
        }
        catch(err){
            console.log("Internal Server Error");
        }
    }

    @Roles(Role.Student, Role.Instructor)
    @UseGuards(AuthGuard, RolesGuard)
    @SubscribeMessage('myChats')
    async getMyChats(client: Socket, userId : any){
        try{
            const success = await this.chatService.getUserChats(userId);
            this.server.emit('my-chats-reply', success);
        }
        catch(err){
            console.log("Internal Server Error");
        }
    }

    @Roles(Role.Student, Role.Instructor)
    @UseGuards(AuthGuard, RolesGuard)
    @SubscribeMessage('browseUsers')
    async getAllUsers(client: Socket){
        try{
            const success = await this.chatService.getAllUsers();
            this.server.emit('browse-users-reply', success);
        }
        catch(err){
            console.log("Internal Server Error");
        }
    }

}