import express from 'express';
import {NoteDto, Note} from '../interfaces/interfaces';
import * as notesRepository from '../repositories/notesRepository';
import {schemaNote, schemaParams} from '../schemas/validationSchemas';
import {getNewDate, getDates} from '../helpers/dateHelper';
import {v4 as uuid} from 'uuid';
import {paramsValidation, bodyValidation} from '../middlewares/validation';
import {ValidationError} from 'yup';

const router = express.Router();

router.get('/', (_req, res) => {
    const notes = notesRepository.getNotes();
    return res.json(notes);
});

router.get('/stats', (_req, res) => {
    const statistics = notesRepository.getStats();
    return res.json(statistics);
});

router.get('/:id', paramsValidation(schemaParams), (req, res) => {
    const {id} = req.params;
    const note = notesRepository.getNoteById(id);
    if (note) {
        return res.json(note);
    }
    return res.status(404).json({error: 'Note not found'});
});

router.post('/', bodyValidation(schemaNote), (req, res) => {
    try {
        const noteDto: NoteDto = req.body;
        const newNote: Note = {
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

        const addedNote = notesRepository.createNote(newNote);
        return res.status(201).json(addedNote);
    } catch (error) {
        if (error instanceof ValidationError) {
            const errors: string[] = error.inner.map((err: any) => err.message);
            return res.status(400).json({errors});
        }

        return res.status(500).json({error: 'Internal Server Error'});
    }
});

router.patch('/:id', bodyValidation(schemaNote), paramsValidation(schemaParams), (req, res) => {
    const {id} = req.params;
    const noteDto: Partial<NoteDto> = req.body;
    const existingNote = notesRepository.getNoteById(id);

    if (!existingNote) {
        return res.status(404).json({error: 'Note not found'});
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

    const result = notesRepository.updateNote(id, updatedNote);
    if (result) {
        return res.json(updatedNote);
    }
    return res.status(500).json({error: 'Failed to update note'});
});


router.delete('/:id', paramsValidation(schemaParams), (req, res) => {
    const {id} = req.params;
    const result = notesRepository.removeNote(id);
    if (result) {
        return res.json({message: 'Note deleted successfully'});
    }
    return res.status(404).json({error: 'Note not found'});
});

export default router;
