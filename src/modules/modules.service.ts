import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from '../Schemas/modules.schema';

@Injectable()
export class ModulesService {
    constructor(@InjectModel('Module') private moduleModel: Model<ModuleDocument>) {}

    async createModule(courseId: string, title: string, content: string, resources: string[], filePath: string[], uploadedBy: string): Promise<Module> {
        return new this.moduleModel({
            course_id: courseId,
            title,
            content,
            resources,
            filePath,
            uploaded_by: uploadedBy
        }).save();
    }

    async getModuleById(moduleId: string): Promise<Module> {
        return this.moduleModel.findById(moduleId).exec();
    }

    async getModulesByCourse(courseId: string): Promise<Module[]> {
        return this.moduleModel.find({ course_id: courseId }).exec();
    }

    async updateModule(moduleId: string, title: string, content: string, resources: string[], filePath: string): Promise<Module> {
        return this.moduleModel.findByIdAndUpdate(moduleId, { title, content, resources, filePath }, { new: true }).exec();
    }

    async deleteModule(moduleId: string): Promise<Module> {
        return this.moduleModel.findByIdAndDelete(moduleId).exec();
    }

    async getAllModules(): Promise<Module[]> {
      return this.moduleModel.find().exec();
  }
}
