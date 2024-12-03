import { HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
        
        // //FOR VALIDATION
        // @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
        // @InjectModel(User.name) private userModel: Model<UserDocument>

    ) {}

    //POSTS
    async createPost(createPostDto: CreatePostDto): Promise<PostDocument> {
        
        
        // //Validating the course and the author by checking if they are present in the database
        // const course = await this.courseModel.findById(createPostDto.course);
        // const author = await this.userModel.findById(createPostDto.author);

        // if (!course) {throw new HttpException('Course not found', HttpStatus.NOT_FOUND);}
        // if (!author) {throw new HttpException('Author not found', HttpStatus.NOT_FOUND);}

        //Creating the post
        const createdPost = new this.postModel(createPostDto);
        return createdPost.save();
    }

    async getPostsByCourse(courseId:string): Promise<PostDocument[]> {
        return this.postModel.find({ course: courseId }).sort({ createdAt:-1 }).exec();
    }

    async deletePost(postId: string): Promise<PostDocument> {
        return this.postModel.findByIdAndDelete(postId);
    }

    //COMMENTS
    async createComment(createCommentDto: CreateCommentDto): Promise<CommentDocument> {

        // //Validating the post and the author by checking if they are present in the database
        // const post = await this.postModel.findById(createCommentDto.post);
        // const author = await this.userModel.findById(createCommentDto.author);

        // if (!post) {throw new HttpException('Post not found', HttpStatus.NOT_FOUND);}
        // if (!author) {throw new HttpException('Author not found', HttpStatus.NOT_FOUND);}

        //Creating the comment
        const createdComment = new this.commentModel(createCommentDto);
        return createdComment.save();
    }

    async getCommentsByPost(postId:string): Promise<CommentDocument[]> {
        return this.commentModel.find({ post: postId }).sort({ createdAt:-1 }).exec();
    }

    async deleteComment(commentId: string): Promise<CommentDocument> {
        return this.commentModel.findByIdAndDelete(commentId);
    }

}
