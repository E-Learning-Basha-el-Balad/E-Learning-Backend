import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DiscussionsService } from './discussions.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ValidationPipe, Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true, namespace: '/forum' })
export class DiscussionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(DiscussionsGateway.name);

  constructor(private discussionsService: DiscussionsService) {}

  // Connection event
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connected', { message: 'Welcome to the Discussion Forum' });
  }

  // Disconnection event
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Listen for new post creation
  @SubscribeMessage('createPost')
  async handleCreatePost(@MessageBody(new ValidationPipe()) payload: CreatePostDto,client:Socket) {
    try {
      const post = await this.discussionsService.createPost(payload);
      this.server.to(`course_${payload.course}`).emit('postCreated', post);
      this.logger.log(`Post created in course_${payload.course}`);
    } catch (error) {
      this.logger.error(`Error creating post: ${error.message}`, error.stack);
      client.emit('error', { message: 'Failed to create post', details: error.message });
    }
  }

  // Listen for new comment creation
  @SubscribeMessage('createComment')
  async handleCreateComment(@MessageBody(new ValidationPipe()) payload: CreateCommentDto,client:Socket) {
    try {
      const comment = await this.discussionsService.createComment(payload);
      this.server.to(`post_${payload.post}`).emit('commentCreated', comment);
      this.logger.log(`Comment created in post_${payload.post}`);
    } catch (error) {
      this.logger.error(`Error creating comment: ${error.message}`, error.stack);
      client.emit('error', { message: 'Failed to create comment', details: error.message });
    }
  }

  // Joining a course room for receiving post updates
  @SubscribeMessage('joinCourseRoom')
  handleJoinCourseRoom(@ConnectedSocket() client: Socket, @MessageBody() courseId: string) {
    const roomName = `course_${courseId}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} joined course room ${roomName}`);
    client.emit('roomJoined', {
      room: roomName,
      message: `You have joined the forum for course: ${courseId}`,
    });
  }

  // Leaving a course room
  @SubscribeMessage('leaveCourseRoom')
  handleLeaveCourseRoom(@ConnectedSocket() client: Socket, @MessageBody() courseId: string) {
    const roomName = `course_${courseId}`;
    client.leave(roomName);
    this.logger.log(`Client ${client.id} left course room ${roomName}`);
    client.emit('roomLeft', {
      room: roomName,
      message: `You have left the forum for course: ${courseId}`,
    });
  }

  // Joining a specific post room for receiving comment updates
  @SubscribeMessage('joinPostRoom')
  handleJoinPostRoom(@ConnectedSocket() client: Socket, @MessageBody() postId: string) {
    const roomName = `post_${postId}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} joined post room ${roomName}`);
    client.emit('roomJoined', { room: roomName, message: `You have joined post: ${postId}` });
  }

  // Leaving a post room
  @SubscribeMessage('leavePostRoom')
  handleLeavePostRoom(@ConnectedSocket() client: Socket, @MessageBody() postId: string) {
    const roomName = `post_${postId}`;
    client.leave(roomName);
    this.logger.log(`Client ${client.id} left post room ${roomName}`);
    client.emit('roomLeft', { room: roomName, message: `You have left post: ${postId}` });
  }
}
