import express from 'express';
import {NoteDto, Note} from '../interfaces/interfaces';
import * as notesRepository from '../repositories/notesRepository';
import {schemaNote, schemaParams} from '../schemas/validationSchemas';
import {getNewDate, getDates} from '../helpers/dateHelper';
import {v4 as uuid} from 'uuid';
import {paramsValidation, bodyValidation} from '../middlewares/validation';
import {ValidationError} from 'yup';

const router = express.Router();

router.get('/', async (_req, res) => {
    const notes = await notesRepository.getNotes();
    return res.json(notes);
});

router.get('/stats', async (_req, res) => {
    const statistics = await notesRepository.getStats();
    return res.json(statistics);
});

router.get('/:id', paramsValidation(schemaParams), async (req, res) => {
    const {id} = req.params;
    const note = await notesRepository.getNoteById(id);
    if (note) {
        return res.json(note);
    }
    return res.status(404).json({error: 'Note not found'});
});

router.post('/', bodyValidation(schemaNote), async (req, res) => {
    try {
        const noteDto: any = req.body;
        console.log('Received noteDto:', noteDto);

        const newNote: any = {
            ...noteDto,
            id: uuid(),
            created: getNewDate(),
            dates: getDates(noteDto.content),
        };

        if ('archived' in req.body) {
            newNote.archived = req.body.archived;
        } else {
            newNote.archived = false;
        }

        const addedNote = await notesRepository.createNote(newNote);

        const response = {
            message: 'Note successfully created',
            ...addedNote
        };

        return res.status(201).json(response);
    } catch (error) {

        if (error instanceof ValidationError) {
            const errors: string[] = error.inner.map((err: any) => err.message);
            return res.status(400).json({errors});
        }

        return res.status(500).json({error: 'Internal Server Error'});
    }
});



router.patch('/:id', bodyValidation(schemaNote), paramsValidation(schemaParams), async (req, res) => {
    const { id } = req.params;
    const noteDto: Partial<NoteDto> = req.body;
    const existingNote = await notesRepository.getNoteById(id);

    if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
    }

    const allowedProperties = ['name', 'category', 'content', 'archived'];
    const unknownProperties = Object.keys(req.body).filter((key) => !allowedProperties.includes(key));

    if (unknownProperties.length > 0) {
        return res.status(400).json({
            errors: [`The following properties are not allowed: ${unknownProperties.join(', ')}`],
        });
    }

    const updatedNote: Note = {
        ...existingNote,
        ...noteDto,
        archived: noteDto.archived !== undefined ? noteDto.archived : false,
        created: getNewDate(),
        dates: typeof noteDto.content === 'string' ? getDates(noteDto.content) : '',
    };

    try {
        const result = await notesRepository.updateNote(id, updatedNote);

        if (!result) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const response = {
            message: 'Note successfully updated',
            ...result
        };

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ error: `Error updating note with id ${id}` });
    }
});



router.delete('/:id', paramsValidation(schemaParams), async (req, res) => {
    const {id} = req.params;
    const result = await notesRepository.removeNote(id);
    if (result) {
        return res.json({message: 'Note deleted successfully'});
    }
    return res.status(404).json({error: 'Note not found'});
});

export default router;