import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';


@Controller('discussions')
export class DiscussionsController {
    constructor(private discussionsService: DiscussionsService) {}

    /*
        Only 2 API endpoints are needed for the discussions forum module:

        1) Get all posts by course
        2) Get all comments by post

        The reason only those 2 endpoints are needed is because as soon as soon as the user navigates to the disucssion forum page for a specific course,
        they should be able to see all the previous posts and comments for that course. The other services and the demonstration of any new posts
        or comments will be handled in the gateway since they will need to be handled in real time.


    */

    // 1) Get all posts by course
    @Get('posts/:courseId')
    getPostsByCourse(@Param('courseId') courseId: string) {
        return this.discussionsService.getPostsByCourse(courseId);
    }

    // 2)Get all comments by post
    @Get('comments/:postId')
    getCommentsByPost(@Param('postId') postId: string) {
        return this.discussionsService.getCommentsByPost(postId);
    }
    
}
