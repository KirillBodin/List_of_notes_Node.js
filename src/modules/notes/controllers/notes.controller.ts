import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UsePipes,
    HttpCode,
    HttpStatus,
    NotFoundException,
    InternalServerErrorException
} from '@nestjs/common';
import {NotesService} from '../services/notes.service';
import {Note} from '../interfaces/note.interface';
import {Category} from '../interfaces/category.interface';
import {NoteDto} from '../dto/note.dto';
import {NoteResponse} from '../interfaces/notes.response.interface';
import {getDates, getNewDate} from '../../../helpers/dateHelper';
import {ValidationPipe} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService) {
    }

    @Get()
    getAllNotes(): Note[] {
        try {
            return this.notesService.getAllNotes();
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Failed to retrieve notes',
                error: 'Notes retrieval error'
            });
        }
    }

    @Get('stats')
    getStats(): Category[] {
        try {
            return this.notesService.getStats();
        } catch (error) {
            throw new InternalServerErrorException({
                message: 'Failed to retrieve stats',
                error: 'Stats retrieval error'
            });
        }
    }

    @Get(':id')
    getNoteById(@Param('id') id: string): NoteResponse {
        try {
            const note = this.notesService.getNoteById(id);
            return {message: 'Item retrieved successfully', ...note} as NoteResponse;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({message: 'Item not found', error: 'Note not found'});
            } else {
                throw new InternalServerErrorException({
                    message: 'Failed to retrieve note',
                    error: 'Note retrieval error'
                });
            }
        }
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    removeNote(@Param('id') id: string): NoteResponse {
        try {
            this.notesService.removeNote(id);
            return {message: 'Item removed successfully'} as NoteResponse;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({message: 'Item not found', error: 'Note not found'});
            } else {
                throw new InternalServerErrorException({message: 'Failed to remove note', error: 'Note removal error'});
            }
        }
    }


    @Post()
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    @HttpCode(HttpStatus.CREATED)
    createNote(@Body() note: NoteDto): NoteResponse {
        try {
            const newNote: Note = {
                ...note,
                id: uuidv4(),
                created: getNewDate(),
                dates: getDates(note.content),
            };
            const createdNote = this.notesService.createNote(newNote);
            return {message: 'Post created successfully', ...createdNote} as NoteResponse;
        } catch (error) {
            throw new InternalServerErrorException({message: 'Failed to create note', error: 'Note creation error'});
        }
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
    updateNote(@Param('id') id: string, @Body() note: Partial<NoteDto>): NoteResponse {
        try {
            const updatedData: Partial<Note> = {
                ...note,
                archived: note.archived !== undefined ? note.archived : false,
                created: getNewDate(),
                dates: typeof note.content === 'string' ? getDates(note.content) : '',
            };
            const updatedNote = this.notesService.updateNote(id, updatedData);
            return {message: 'Post updated successfully', ...updatedNote} as NoteResponse;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException({message: 'Item not found', error: 'Note not found'});
            } else {
                throw new InternalServerErrorException({message: 'Failed to update note', error: 'Note update error'});
            }
        }
    }


}
