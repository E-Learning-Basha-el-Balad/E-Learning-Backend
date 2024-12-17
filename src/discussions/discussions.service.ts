import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Course, CourseDocument } from 'src/Schemas/courses.schema';
import { User, UserDocument } from 'src/Schemas/users.schema';
import { ValidateIdDto } from './dto/validate-id-dto';

//NOTE: ASK ABOUT DB VALIDATION IMPLEMENTATION

@Injectable()
export class DiscussionsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        
        //FOR VALIDATION
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>

    ) {}

    //POSTS

    // Create a new post
    async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {

        //Validating the course and the author by checking if they are present in the database
        const course = await this.courseModel.findById(createPostDto.course);
        const author = await this.userModel.findById(createPostDto.author);

        if (!course) {throw new Error('Course not found');}
        if (!author) {throw new Error('Author not found');}
        
        //Creating the post
        const createdPost = new this.postModel(createPostDto);
        return createdPost.save();
        
    }

    // Get all posts for a specific course
    async getPostsByCourse(courseId: string): Promise<{ message: string, data: PostDocument[] }> {

        // Find all posts for the course and sort them by creation date
        const posts = await this.postModel.find({ course: courseId }).sort({ createdAt:-1 }).exec();

        // If no posts are found return a message saying so
        if (posts.length === 0) 
            return { message: 'No posts found for this course', data: [] };

        
        // Return the posts
        return { message: 'Posts found', data: posts };
    }

    // DELETE POST ( 3 IMPLEMENTATIONS FOR THE 3 DIFFERENT ROLES)

    //(MAMDO) SHOULD USE GUARDS TO CHECK IF THE USER IS AUTHORIZED TO USE THE CORRECT DELETE METHOD

    ////////////////////////////////////////////////////////////////////////////////////

    // Admin
    async deletePostAdmin(postId: string): Promise<PostDocument> {
        return this.postModel.findByIdAndDelete(postId);

        // Guard should handle if it is unauthorized (MAMDO)

    }

    // Instructor
    async deletePostInstructor(postId: string, instructorId: string): Promise<PostDocument> {

        const post = await this.postModel.findById(postId);

        // Checks if the ID entered is the ID of the course instructor
        if (post.course.instructorId.toString() == instructorId) {
            return this.postModel.findByIdAndDelete(postId);
        }

        // Guard should handle if it is unauthorized (MAMDO)
    }

    // Student
    async deletePostStudent(postId: string, studentId: string): Promise<PostDocument> {

        const post = await this.postModel.findById(postId);

        // Checks if the ID entered is the ID of the student who created the post
        if (post.author.toString() == studentId) {
            return this.postModel.findByIdAndDelete(postId);
        }

        // Guard should handle if it is unauthorized (MAMDO)


    }

    ////////////////////////////////////////////////////////////////////////////////////


    //COMMENTS

    // Create a new comment
    async createComment(createCommentDto: CreateCommentDto): Promise<CommentDocument> {

        //Validating the post and the author by checking if they are present in the database
        const post = await this.postModel.findById(createCommentDto.post);
        const author = await this.userModel.findById(createCommentDto.author);

        if (!post) {throw new Error('Post not found');}
        if (!author) {throw new Error('Author not found');}
        
        //Creating the comment
        const createdComment = new this.commentModel(createCommentDto);
        return createdComment.save();

    }

    // Get all comments for a specific post
    async getCommentsByPost(postId: string): Promise<{ message: string, data: CommentDocument[] }> {
            
        // Find all comments for the post and sort them by creation date
        const comments = await this.commentModel.find({ post: postId }).sort({ createdAt:-1 }).exec();
    
        // If no comments are found return a message saying so
        if (comments.length === 0) 
            return { message: 'No comments found for this post', data: [] };
        
            
        // Return the comments
        return { message: 'Comments found', data: comments };

    }
    
    // DELETE COMMENT ( 3 IMPLEMENTATIONS FOR THE 3 DIFFERENT ROLES)
    // (MAMDO) SHOULD USE GUARDS TO CHECK IF THE USER IS AUTHORIZED TO USE THE CORRECT DELETE METHOD
    ////////////////////////////////////////////////////////////////////////////////////

     // Admin
     async deleteCommentAdmin(commentId: string): Promise<CommentDocument> {
        return this.commentModel.findByIdAndDelete(commentId);
    }

    // Instructor
    async deleteCommentInstructor(commentId: string, instructorId: string): Promise<CommentDocument> {
        const comment = await this.commentModel.findById(commentId);
        const post = await this.postModel.findById(comment.post);

        if (post.course.userId.toString() === instructorId) {
            return this.commentModel.findByIdAndDelete(commentId);
        }
        throw new Error('Unauthorized');
    }

    // Student
    async deleteCommentStudent(commentId: string, studentId: string): Promise<CommentDocument> {
        const comment = await this.commentModel.findById(commentId);

        if (comment.author.toString() === studentId) {
            return this.commentModel.findByIdAndDelete(commentId);
        }
        throw new Error('Unauthorized');
    }

    ////////////////////////////////////////////////////////////////////////////////////

    // METHODS FOR NOTIFICATIONS 

    // Get post to handle notifications based on post replies
    async getPostById(postId: string): Promise<PostDocument> {
        return this.postModel.findById(postId);
    }

    // METHODS FOR SEARCH FUNCTIONALITY

    // Search for enrolled coures to access the discussion forum for it
    async searchEnrolledCourses(query: string): Promise<CourseDocument[]> {
        return this.courseModel.find({ name: { $regex: query, $options: 'i' } }).exec();
    }

    // Search for post within a discussion forum

    // Search for posts by title
    async searchPostsTitle(query: string): Promise<PostDocument[]> {
        return this.postModel.find({ title: { $regex: query, $options: 'i' } }).exec();
    }

    // Search for posts by content
    async searchPostsContent(query: string): Promise<PostDocument[]> {
        return this.postModel.find({ content: { $regex: query, $options: 'i' } }).exec();
    }



}
