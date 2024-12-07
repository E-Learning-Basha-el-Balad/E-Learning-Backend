import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ValidateIdDto } from 'src/discussions/dto/validate-id-dto';


@WebSocketGateway({ cors: true, namespace: '/ws/announcement' })
export class AnnouncementsGateway {

  constructor(private readonly announcementsService: AnnouncementsService) {}

  @WebSocketServer() server: Server;

  private readonly logger = new Logger(AnnouncementsGateway.name);

  @SubscribeMessage('announcement:create')
  async handleCreateAnnouncement(@ConnectedSocket() client: Socket, @MessageBody(new ValidationPipe()) payload: CreateAnnouncementDto) {
    try {

      // Handle the creation logic from the service
      const announcement = await this.announcementsService.createAnnouncement(payload);

      // Emit the created post to the corresponding course room of the post creator
      this.server.to(`course_${payload.course}`).emit('announcement:created', announcement);

      client.to(`course_${payload.course}`).emit('notification', { message: 'You have a new reply to your post', data: announcement.content });

      // Log the event for debugging
      this.logger.log(`Announcement created in course_${payload.course}`);

    } catch (error) {

      // Log error and emit error message to the client
      this.logger.error(`Error creating announcement: ${error.message}`, error.stack);
      client.emit('announcement:create:error', { message: 'Failed to create announcement', details: error.message });

    }
  }

  @SubscribeMessage('announcement:delete')
  async handleDeleteAnnouncement(@ConnectedSocket() client: Socket,@MessageBody() announcementId: string){
    try{

      // Handle the deletion logic from the service
      const announcement = await this.announcementsService.deleteAnnouncement(announcementId);

      // Emit the deleted post to the corresponding course room of the post creator
      this.server.to(`course_${announcement.course}`).emit('announcement:deleted', announcement);

      // Log the event for debugging
      this.logger.log(`Announcement deleted in course_${announcement.course}`);

    }catch(error){

      // Log error and emit error message to the client
      this.logger.error(`Error deleting announcement: ${error.message}`, error.stack);
      client.emit('announcement:delete:error', { message: 'Failed to delete announcement', details: error.message });

    }
  }
  

  //HANDLING COURSE ROOMS

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
      client.emit('room:joined:course', { room: roomName, message: `You have joined the forum for course: ${courseId.id}`});

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
      client.emit('room:left:course', { room: roomName, message: `You have left the forum for course: ${courseId.id}`});

    }catch(error){

      // Log error and emit error message to the client
      this.logger.error(`Error leaving course room: ${error.message}`, error.stack);
      client.emit('room:leave:course:error', { message: 'Failed to leave course room', details: error.message });

    }
   
  }

}
