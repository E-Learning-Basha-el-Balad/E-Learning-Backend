import { Module } from '@nestjs/common';
import { DiscussionsController } from './discussions.controller';
import { DiscussionsGateway } from './discussions.gateway';
import { CommentSchema } from './schemas/comment.schema';
import { PostSchema } from './schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionsService } from './discussions.service';
import { UserModule } from 'src/users/users.module';
import { CoursesModule } from 'src/courses/courses.module';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Comment', schema: CommentSchema },
            { name: 'Post', schema: PostSchema }, 
    ]),
    UserModule,
    CoursesModule
    ],
    controllers: [DiscussionsController],
    providers: [DiscussionsService,DiscussionsGateway],
    exports: [MongooseModule]
})
export class DiscussionsModule {}
