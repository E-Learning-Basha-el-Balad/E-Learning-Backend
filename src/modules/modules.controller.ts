import { Controller, Post, Get, Put, Delete, Param, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Multer } from 'multer';
import { diskStorage, FileFilterCallback } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ModulesService } from './modules.service';
import { Module as CourseModule } from '../Schemas/modules.schema';
import NodeModule from 'module';
import { FilesInterceptor } from '@nestjs/platform-express';


// Controller for handling module routes
@Controller('courses/:courseId/modules')
export class ModulesController {
    constructor(private readonly modulesService: ModulesService) {}

    // Multer configuration for file upload
    static multerOptions = {
        storage: diskStorage({
            destination: './uploads/modules',
            filename: (req, file, cb) => {
                const randomName = uuidv4();
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        }),
        fileFilter: (req: any, file: any, cb: FileFilterCallback) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf|csv|xlsx|pptx)$/)) {
                cb(null, true); // Accept file
            } else {
                cb(null, false); // Reject file
            }
        },
        limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
    };

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, ModulesController.multerOptions)) // 'files' is the form data key, 10 is the max number of files
    async createModule(
        @Param('courseId') courseId: string,
        @Body() body,
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<CourseModule> {
        const filePaths = files.map(file => file.path);
        return this.modulesService.createModule(courseId, body.title, body.content, body.resources, filePaths, body.uploadedBy);
    }

/*
    @Post()
    @UseInterceptors(FileInterceptor('file', ModulesController.multerOptions))
    async createModule(
        @Param('courseId') courseId: string,
        @Body() body,
        @UploadedFile() file: Express.Multer.File
    ): Promise<CourseModule> {
        return this.modulesService.createModule(courseId, body.title, body.content, body.resources, file?.path, body.uploadedBy);
    }
*/

    //get module by id
    @Get(':moduleId')
    async getModule(
        @Param('courseId') courseId: string,
        @Param('moduleId') moduleId: string
    ): Promise<CourseModule> {
        return this.modulesService.getModuleById(moduleId);
    }

    //get all modules of a course
    @Get()
    async getModules(
        @Param('courseId') courseId: string
    ): Promise<CourseModule[]> {
        return this.modulesService.getModulesByCourse(courseId);
    }

    //update module
    @Put(':moduleId')
    @UseInterceptors(FileInterceptor('file', ModulesController.multerOptions))
    async updateModule(
        @Param('courseId') courseId: string,
        @Param('moduleId') moduleId: string,
        @Body() body,
        @UploadedFile() file: Express.Multer.File
    ): Promise<CourseModule> {
        return this.modulesService.updateModule(moduleId, body.title, body.content, body.resources, file?.path);
    }


    //delete module
    @Delete(':moduleId')
    async deleteModule(
        @Param('courseId') courseId: string,
        @Param('moduleId') moduleId: string
    ): Promise<CourseModule> {
        return this.modulesService.deleteModule(moduleId);
    }


    //get all modules
    @Get()
    async getAllModules(): Promise<CourseModule[]> {
        return this.modulesService.getAllModules();
    }

}
