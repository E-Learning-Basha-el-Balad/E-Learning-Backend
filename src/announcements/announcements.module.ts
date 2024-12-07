import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsGateway } from './announcements.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnouncementSchema } from './schema/announcement.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Announcement', schema: AnnouncementSchema }])],
  providers: [AnnouncementsService, AnnouncementsGateway],
  controllers: [AnnouncementsController]
})
export class AnnouncementsModule {}
