  import { Controller, Post, Get,Req, Patch, Delete, Body, Param, UseGuards, Put,Logger } from '@nestjs/common';
  import { NotesService } from './notes.service';
  import { CreateNoteDto } from './dto/create-note.dto';
  import { UpdateNoteDto } from './dto/update-note.dto';
  import { AutoSaveDto } from './dto/autosave-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';

  @Controller('notes')
  export class NotesController {
    private readonly logger = new Logger(NotesService.name);
    constructor(private readonly notesService: NotesService) {}
   @UseGuards(AuthGuard)
    @Post()
    create(@Body() body: any,@Req() req:any) {
      this.logger.log(body)
      this.logger.log(req.user.sub)
      return this.notesService.create(body.title, body.content,body.moduleId,req.user.sub);
    }
    @UseGuards(AuthGuard)
    @Get('/:moduleId')
    findAll( @Param('moduleId') moduleId: string , @Req() req :any) {
      return this.notesService.findAll(req.user.sub, moduleId);
    }
    @Get(':noteId')
    findOne(@Param('noteId') noteId: string) {
      return this.notesService.findOne(noteId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
      return this.notesService.update(id, updateNoteDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
      return this.notesService.delete(id);
    }

    @Patch(':id')
    autosave(@Param('id') id: string, @Body() AutoSaveDto: AutoSaveDto) {
      return this.notesService.autosave(id, AutoSaveDto);
    }
  }