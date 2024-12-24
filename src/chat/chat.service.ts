import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo, Types } from 'mongoose';
import { Chat } from '../Schemas/chat.schema';
import { Message } from '../Schemas/message.schema';
import { User } from '../Schemas/users.schema'
import { MessageDto } from './dto/message.dto';
import { GroupChatDto } from './dto/groupchat.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private chatModel : Model<Chat>,
        @InjectModel(Message.name) private messageModel : Model<Message>,
        @InjectModel(User.name) private userModel : Model<User>
    ) {}

    async getAllUsers(): Promise<User[]> {
        const result = await this.userModel.find({ role: { $ne: 'admin' } }).exec();
        return result;
    }    

    async getUserChats(userId: any): Promise<Chat[]> {
        const chats = await this.chatModel.find({
          users: userId.userId
        }).exec();
        // Process chats to dynamically set names for private chats
        const processedChats = await Promise.all(
          chats.map(async (chat) => {
            if (chat.chatType === 'private') {
              // Find the other user's ID
              const otherUserId = chat.users.filter((user: Types.ObjectId) => user !== userId.userId);
              
              // Fetch the other user's name from the database
              const otherUser = await this.userModel.findById(otherUserId).exec();
              
              // Dynamically set the chat name to the other user's name
              chat.name = otherUser?.name || 'Unnamed Chat';
            }
      
            // Return the chat as is for group chats or once processed
            return chat;
          })
        );

        return processedChats;
      }

    async createMessage(messageDto : MessageDto): Promise<unknown>{
        try{
            const message = plainToClass(MessageDto, messageDto);

            const { sender, chat, content } = message;

            let targetChat = await this.chatModel.findById(chat).exec();

            if(!targetChat){

                const receivingUser = await this.userModel.findById(chat).exec();

                const sendingUser = await this.userModel.findById(sender).exec();

                if(!receivingUser) throw new Error('Invalid chat or receiver id');

                const sortedUsers = [sender, chat].sort();

                if(receivingUser.role === 'admin' || sendingUser.role === 'admin')
                    throw new Error('Admin cannot send message');
                
                targetChat = await this.chatModel.findOne({
                    users: { $all: sortedUsers, $size: 2 },
                    chatType: 'private'
                });

                if(!targetChat){
                    targetChat = new this.chatModel({
                        users: sortedUsers,
                        messages: []
                    });

                    await targetChat.save();
                }

            }

            const newMessage = new this.messageModel({
                sender,
                chat: targetChat._id,
                content
            });

            const success = await newMessage.save();

            targetChat.messages.push(success._id);

            await targetChat.save();

            return { sender : (await this.userModel.findById(sender)).name , message: content };
        }
        catch(err){
            console.log("The error is ", err);
            throw new Error("Error creating message");
        }
    }

    async getChat(chat: any): Promise<unknown[]>{
        const objectId = chat._id;

       // console.log(chat);

        const success = await this.chatModel.findById(objectId).exec();

      //  console.log(success);

        if(!success)throw new Error('Chat not found');



        const messages = await this.messageModel.find({ _id: { $in: success.messages } }).sort({ sentAt: 1 }).exec();
        
        const result = await Promise.all(
            messages.map(async (message) => {
                const sender = await this.userModel.findById(message.sender);
                return { sender: sender?.name || 'Unknown', message: message.content };
            })
        );

        return result;
    }

    async createGroup(groupChatDto : GroupChatDto): Promise<Chat>{

        const { name , users } = groupChatDto;

        for(let user of users){

            const currentUser = await this.userModel.findById(user).exec();

            if(currentUser.role === 'admin')
                throw new Error('Group chats are for students and instructors only');
        }

        const existingGroup = await this.chatModel.findOne({
            users: { $all: users, $size: users.length },
            name: name
        });

        if(existingGroup) throw new Error('Group chat already exists');

        const success = new this.chatModel({
            name: name,
            users: users,
            chatType: 'group',
            messages: []
        });

        const result = await success.save();

        return result;
    }

}
