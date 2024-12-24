import { Injectable, NotFoundException, InternalServerErrorException,Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../Schemas/notes.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AutoSaveDto } from './dto/autosave-note.dto';

@Injectable()
export class NotesService {
   private readonly logger = new Logger(NotesService.name);
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(title:any,notebody:any,moduleId:any,userID:any ): Promise<Note> {
    const note = new this.noteModel({title:title,content:notebody,studentId:userID,moduleId:moduleId});
    return note.save();
  }

  async findAll(studentId: string, moduleId: string): Promise<Note[]> {
    return this.noteModel.find({ studentId, moduleId }).exec();
  }

  async findOne(noteId: string): Promise<Note> {
    return this.noteModel.findOne({ _id: noteId }).exec();
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {

    id = id.trim();
    const note = await this.noteModel.findByIdAndUpdate(id, updateNoteDto, {
      new: true,
      runValidators: true,
    });
  
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async delete(id: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
  async autosave(id: string, AutoSaveDto: AutoSaveDto): Promise<Note> {
    id = id.trim();
    const note = await this.noteModel.findByIdAndUpdate(id, AutoSaveDto, {
      new: true,
      runValidators: true,
    });
  
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }
}  
