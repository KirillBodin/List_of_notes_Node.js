import {Note, Category} from "../interfaces/interfaces";
import NoteModel from "../models/NoteModel";
import {getDates, getNewDate} from "../helpers/dateHelper";

export const getNotes = async (): Promise<Note[]> => {
    try {
        const noteModels = await NoteModel.findAll();
        const notes: Note[] = noteModels.map(noteModel => ({
            id: noteModel.id,
            name: noteModel.name,
            category: noteModel.category,
            content: noteModel.content,
            created: noteModel.created,
            dates: noteModel.dates,
            archived: noteModel.archived,
        }));
        return notes;
    } catch (error) {
        throw new Error("Error fetching notes");
    }
}


export const getNoteById = async (id: string): Promise<Note | null> => {
    try {
        const noteModel = await NoteModel.findByPk(id);
        if (noteModel === null) {
            return null;
        }
        const note: Note = {
            id: noteModel.id,
            name: noteModel.name,
            category: noteModel.category,
            content: noteModel.content,
            created: noteModel.created,
            dates: noteModel.dates,
            archived: noteModel.archived,
        };
        return note;
    } catch (error) {
        throw new Error(`Error fetching note with id ${id}`);
    }
};

export const updateNote = async (id: string, updatedNote: Note): Promise<Note | null> => {
    try {
        const [rowsUpdated, [updatedNoteInstance]] = await NoteModel.update({
            name: updatedNote.name,
            category: updatedNote.category,
            content: updatedNote.content,
            archived: updatedNote.archived,
            created: getNewDate(),
            dates: getDates(updatedNote.dates),
        }, {
            where: {id},
            returning: true,
        });

        if (rowsUpdated === 0) {
            return null;
        }

        return {
            id: updatedNoteInstance.id,
            name: updatedNoteInstance.name,
            category: updatedNoteInstance.category,
            content: updatedNoteInstance.content,
            created: updatedNoteInstance.created,
            dates: updatedNoteInstance.dates,
            archived: updatedNoteInstance.archived,
        };
    } catch (error) {
        throw new Error(`Error updating note with id ${id}`);
    }
};


export const removeNote = async (id: string): Promise<boolean> => {
    try {
        const rowsDeleted = await NoteModel.destroy({where: {id}});

        if (rowsDeleted === 0) {
            return false;
        }

        return true;
    } catch (error) {
        throw new Error(`Error deleting note with id ${id}`);
    }
};

export const getStats = async (): Promise<Category[]> => {
    try {
        const notes = await NoteModel.findAll();

        return notes.reduce<Category[]>((acc, note) => {
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
    } catch (error) {
        throw new Error("Error fetching statistics");
    }
};
export const createNote = async (note: Note): Promise<Note> => {
    try {
        console.log('Creating new note:', note);

        const newNoteModel = await NoteModel.create({
            id: note.id,
            name: note.name,
            category: note.category,
            content: note.content,
            archived: note.archived,
            created: getNewDate(),
            dates: getDates(note.dates),
        });

        console.log('New note model:', newNoteModel.toJSON());

        const newNote: Note = {
            id: newNoteModel.id,
            name: newNoteModel.name,
            category: newNoteModel.category,
            content: newNoteModel.content,
            created: newNoteModel.created,
            dates: newNoteModel.dates,
            archived: newNoteModel.archived,
        };


        return newNote
    } catch (error) {
        throw new Error("Error creating note");
    }
};





