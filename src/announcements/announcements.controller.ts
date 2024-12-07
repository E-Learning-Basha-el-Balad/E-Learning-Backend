import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';




@Controller('announcements')
export class AnnouncementsController {
    constructor(private announcementsService: AnnouncementsService) {}

     /*
        Only 1 API endpoint is needed for the announcements module:

        1) Get all announcements by course

        The reason only this endpoint is needed is because as soon as soon as the user navigates to the announcements page for a specific course, previous announcements 
        for that course should be displayed. The other services and the demonstration of any new announcements will be handled in the gateway since they will need to be handled in
        real time.

    */

    //GET ANNOUNCEMENTS BY COURSE
    @Get(':courseId')
    getAnnouncementsByCourse(@Param('courseId') courseId: string) {
        return this.announcementsService.getAnnouncementsByCourse(courseId);
    }

}
