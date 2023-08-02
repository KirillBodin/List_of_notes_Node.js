import express from 'express';
import {schemaNote, schemaParams} from '../schemas/validationSchemas';
import * as yup from 'yup';
import {ValidationError} from 'yup';

export const bodyValidation = (schema: typeof schemaNote) => async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const {name, category, content, archived} = req.body;

    if (typeof name !== 'string' || typeof category !== 'string' || typeof content !== 'string' || typeof archived !== 'boolean') {
        return res.status(400).json({errors: ['Invalid data types']});
    }
    try {
        await schema.validate(req.body);
        next();
    } catch (error) {
        if (error instanceof ValidationError) {
            const errors: string[] = error.errors;
            return res.status(400).json({errors});
        }
        return res.status(500).json({error: 'Internal Server Error'});
    }
};


export const paramsValidation =
    (schema: typeof schemaParams) =>
        async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            try {
                await schema.validate(req.params, {abortEarly: false});
                next();
            } catch (error: unknown) {
                if (error instanceof yup.ValidationError) {
                    const errors: string[] = error.inner.map((err) => err.message);
                    return res.status(400).json({errors});
                }
                return res.status(500).json({error: 'Internal Server Error'});
            }
        };


