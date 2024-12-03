import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ValidateIdDto } from './dto/validate-id-dto';

@Controller('discussions')
export class DiscussionsController {
    constructor(private discussionsService: DiscussionsService) {}
    //POSTS

    // //Create a new post
    // @Post('posts')
    // @UsePipes(new ValidationPipe())
    // createPost(@Body() createPostDto: CreatePostDto) {
    //     return this.discussionsService.createPost(createPostDto);
    // }

    //Get all posts by course
    @Get('posts/:courseId')
    getPostsByCourse(@Param('courseId') courseId: string) {
        return this.discussionsService.getPostsByCourse(courseId);
    }

    // //Delete a post
    // @Delete('posts/:postId')
    // deletePost(@Param() postId: ValidateIdDto) {
    //     return this.discussionsService.deletePost(postId);
    // }

    //COMMENTS

    // //Create a new comment
    // @Post('comments')
    // @UsePipes(new ValidationPipe())
    // createComment(@Body() createCommentDto: CreateCommentDto) {
    //     return this.discussionsService.createComment(createCommentDto);
    // }

    //Get all comments by post
    @Get('comments/:postId')
    getCommentsByPost(@Param('postId') postId: string) {
        return this.discussionsService.getCommentsByPost(postId);
    }

    // //Delete a comment
    // @Delete('comments/:commentId')
    // deleteComment(@Param() commentId: ValidateIdDto) {
    //     return this.discussionsService.deleteComment(commentId);
    // }

    
}
