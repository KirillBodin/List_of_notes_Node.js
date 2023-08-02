import {Note, Category, NoteDto} from "../interfaces/interfaces";
import * as store from "../data/notesData";
import {Notes} from "../data/notesData";

export const getNotes = (): Note[] => Notes;

export const getNoteById = (id: string): Note | undefined =>
    Notes.find((note) => note.id === id);


export const updateNote = (id: string, updatedNote: Note): Note | undefined => {
    const index = Notes.findIndex((note) => note.id === id);
    if (index !== -1) {
        Notes[index] = updatedNote;
        return updatedNote;
    }
    return undefined;
};

export const removeNote = (id: string): boolean => {
    const index = Notes.findIndex((note) => note.id === id);
    if (index !== -1) {
        Notes.splice(index, 1);
        return true;
    }
    return false;
};

export const getStats = (): Category[] => {
    return store.Notes.reduce<Category[]>((acc, note) => {
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
};

export const createNote = (note: Note): Note => {
    const newNote: Note = {
        ...note,
        archived: note.archived,
    };

    Notes.push(newNote);
    return newNote;
};

