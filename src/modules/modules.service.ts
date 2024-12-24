import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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


    async deleteModuleFile(moduleId:string,deleted:string[]){
        return await this.moduleModel.updateOne(
            { _id: moduleId },  // Match the module by its ID
            {
              $pull: {
                filePath: { $in: deleted }  // Remove all file paths that match any value in the 'deletedFiles' array
              }
            }
        )

    }

    async getModuleById(moduleId: string): Promise<Module> {
        return this.moduleModel.findById(moduleId).exec();
    }

    async getModulesByCourse(courseId: string): Promise<Module[]> {
        return this.moduleModel.find({ course_id: courseId }).exec();
    }

    async updateModule(moduleId: string, title: string, content: string, resources: string, filePath: string[]): Promise<Module> {
        return this.moduleModel.findByIdAndUpdate(
            moduleId,
            { 
                $push: { filePath: { $each: filePath } }, 
                title, content, resources
            },
            { new: true }
        ).exec();
    }

    async deleteModule(moduleId: string): Promise<Module> {
        return this.moduleModel.findByIdAndDelete(moduleId).exec();
    }

    async getAllModules(): Promise<Module[]> {
      return this.moduleModel.find().exec();
  }


  async flagModule(moduleId:string,flag:boolean){
    const module = await this.moduleModel.findById(moduleId)

    if(!module){
        throw new NotFoundException("MODULE CANNOT BE FOUND")
    }

    if(module.outdated ==flag){
        throw new ConflictException(`MODULE OUTDATED STATUS IS ALREADY ${flag}`)
    }

   

    return this.moduleModel.updateOne( 
        { _id: moduleId },  
        { $set: { outdated: flag } })
  }
}
