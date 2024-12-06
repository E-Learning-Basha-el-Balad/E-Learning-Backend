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
import { ValidateIdDto } from './dto/validate-id-dto';

@WebSocketGateway({ cors: true, namespace: '/forum' })
export class DiscussionsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // GATEWAY VARIABLES

  // Global server instance to emit events to all connected clients
  @WebSocketServer() server: Server;

  // Logger instance for testing and logging events
  private readonly logger = new Logger(DiscussionsGateway.name);

  // Injecting the discussions service to handle business logic
  constructor(private discussionsService: DiscussionsService) {}

  // CONNECT/DISCONNECT EVENTS

  // Connection event
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connected', { message: 'Welcome to the Discussion Forum' });
  }

  // Disconnection event
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // POST EVENTS

  // Listen for new post creation
  @SubscribeMessage('post:create')
  async handleCreatePost(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) payload: CreatePostDto) {
    try {

      // Handle the creation logic from the service
      const post = await this.discussionsService.createPost(payload);

      // Emit the created post to the corresponding course room of the post creator
      this.server.to(`course_${payload.course}`).emit('post:created', post);

      // Log the event for debugging
      this.logger.log(`Post created in course_${payload.course}`);

    } catch (error) {

      // Log error and emit error message to the client
      this.logger.error(`Error creating post: ${error.message}`, error.stack);
      client.emit('post:create:error', { message: 'Failed to create post', details: error.message });

    }
  }

  // Listen for post deletion
  @SubscribeMessage('post:delete')
  async handleDeletePost(@ConnectedSocket() client: Socket, @MessageBody() postId: string) {
    try {

      // Handle the deletion logic from the service
      const post = await this.discussionsService.deletePost(postId);

      // Emit the deleted post to the corresponding course room of the post creator
      this.server.to(`course_${post.course}`).emit('post:deleted', post);

      // Log the event for debugging
      this.logger.log(`Post deleted in course_${post.course}`);

    } catch (error) {

      // Log error and emit error message to the client
      this.logger.error(`Error deleting post: ${error.message}`, error.stack);
      client.emit('post:delete:error', { message: 'Failed to delete post', details: error.message });

    }
  }

  //COMMENT EVENTS

  // Listen for new comment creation
  @SubscribeMessage('comment:create')
  async handleCreateComment(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) payload: CreateCommentDto) {
    try {

      // Handle the creation logic from the service
      const comment = await this.discussionsService.createComment(payload);

      // Emit the created comment to the corresponding post room of the comment creator
      this.server.to(`post_${payload.post}`).emit('comment:created', comment);

      // Log the event for debugging
      this.logger.log(`Comment created in post_${payload.post}`);

    } catch (error) {

      // Log error and emit error message to the client
      this.logger.error(`Error creating comment: ${error.message}`, error.stack);
      client.emit('comment:create:error', { message: 'Failed to create comment', details: error.message });

    }
  }

  //Listen for comment deletion
  @SubscribeMessage('comment:delete')
  async handleDeleteComment(@ConnectedSocket() client: Socket, @MessageBody() commentId: string) {
    try {

      // Handle the deletion logic from the service
      const comment = await this.discussionsService.deleteComment(commentId);

      // Emit the deleted comment to the corresponding post room of the comment creator
      this.server.to(`post_${comment.post}`).emit('comment:deleted', comment);

      // Log the event for debugging
      this.logger.log(`Comment deleted in post_${comment.post}`);

    } catch (error) {

      // Log error and emit error message to the client
      this.logger.error(`Error deleting comment: ${error.message}`, error.stack);
      client.emit('comment:delete:error', { message: 'Failed to delete comment', details: error.message });

    }
  }

  // ROOM CONNECT/DISONNECT EVENTS

  // COURSE ROOMS

  // Joining a course room for recieving post updates for a specific course
  @SubscribeMessage('room:join:course')
  handleJoinCourseRoom(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe) courseId: ValidateIdDto) {
    try{
      
      // Obtain the room name from the course id
      const roomName = `course_${courseId.id}`;

      // Join the room
      client.join(roomName);

      // Log the event for debugging
      this.logger.log(`Client ${client.id} joined course room ${roomName}`);

      // Emit a message to the client that they have joined the room
      client.emit('room:joined:course', { room: roomName, message: `You have joined the forum for course: ${courseId}`});

    }catch(error){
      
      // Log error and emit error message to the client
      this.logger.error(`Error joining course room: ${error.message}`, error.stack);
      client.emit('room:join:course:error', { message: 'Failed to join course room', details: error.message });

    }
    
  }

  // Leaving a course room
  @SubscribeMessage('room:leave:course')
  handleLeaveCourseRoom(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) courseId: ValidateIdDto) {
    try{

      // Obtain the room name from the course id
      const roomName = `course_${courseId.id}`;

      // Leave the room
      client.leave(roomName);

      // Log the event for debugging
      this.logger.log(`Client ${client.id} left course room ${roomName}`);

      // Emit a message to the client that they have left the room
      client.emit('room:left:course', { room: roomName, message: `You have left the forum for course: ${courseId}`});

    }catch(error){

      // Log error and emit error message to the client
      this.logger.error(`Error leaving course room: ${error.message}`, error.stack);
      client.emit('room:leave:course:error', { message: 'Failed to leave course room', details: error.message });

    }
   
  }

  // POST ROOMS

  // Joining a post room for recieving comment updates for a specific post
  @SubscribeMessage('room:join:post')
  handleJoinPostRoom(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) postId: ValidateIdDto) {
    try{

      // Obtain the room name from the post id
      const roomName = `post_${postId.id}`;

      // Join the room
      client.join(roomName);

      // Log the event for debugging
      this.logger.log(`Client ${client.id} joined post room ${roomName}`);

      // Emit a message to the client that they have joined the room
      client.emit('room:joined:post', { room: roomName, message: `You have joined post: ${postId}` });

    }catch(error){

      // Log error and emit error message to the client
      this.logger.error(`Error joining post room: ${error.message}`, error.stack);
      client.emit('room:join:post:error', { message: 'Failed to join post room', details: error.message });

    }
    
  }

  // Leaving a post room
  @SubscribeMessage('room:leave:post')
  handleLeavePostRoom(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) postId: ValidateIdDto) {
    try{

      // Obtain the room name from the post id
      const roomName = `post_${postId.id}`;

      // Leave the room
      client.leave(roomName);

      // Log the event for debugging
      this.logger.log(`Client ${client.id} left post room ${roomName}`);

      // Emit a message to the client that they have left the room
      client.emit('room:left:post', { room: roomName, message: `You have left post: ${postId}` });

    }catch(error){

      // Log error and emit error message to the client
      this.logger.error(`Error leaving post room: ${error.message}`, error.stack);
      client.emit('room:leave:post:error', { message: 'Failed to leave post room', details: error.message });
      
    }
    
  }
}
