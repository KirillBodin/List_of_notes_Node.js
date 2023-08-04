import {Injectable, NotFoundException} from '@nestjs/common';
import {Note} from '../interfaces/note.interface';
import {Category} from '../interfaces/category.interface';
import {notesData} from '../../../data/notes.data';
import {v4 as uuidv4} from 'uuid';
import {getNewDate} from "../../../helpers/dateHelper";

@Injectable()
export class NotesService {
    private notes: Note[] = [...notesData];

    getAllNotes(): Note[] {
        return this.notes;
    }

    getNoteById(id: string): Note {
        const note = this.notes.find((note) => note.id === id);
        if (!note) {
            throw new NotFoundException('Item not found');
        }
        return note;
    }

    createNote(note: Note): Note {
        const newNote: Note = {...note, id: uuidv4(), created: getNewDate()};
        this.notes.push(newNote);
        return newNote;
    }


    updateNote(id: string, updatedNote: Partial<Note>): Note {
        const index = this.notes.findIndex((note) => note.id === id);
        if (index === -1) {
            throw new NotFoundException('Item not found');
        }
        this.notes[index] = {...this.notes[index], ...updatedNote};
        return this.notes[index];
    }

    removeNote(id: string): boolean {
        const index = this.notes.findIndex((note) => note.id === id);
        if (index === -1) {
            throw new NotFoundException('Item not found');
        }
        this.notes.splice(index, 1);
        return true;
    }

    getStats(): Category[] {
        return this.notes.reduce<Category[]>((acc, note) => {
            const category = acc.find((cat) => cat.name === note.category);

            if (!category) {
                return [
                    ...acc,
                    {
                        name: note.category,
                        active: note.archived ? 0 : 1,
                        archived: note.archived ? 1 : 0,
                    },
                ];
            }

            note.archived ? category.archived++ : category.active++;
            return acc;
        }, []);
    }
}
