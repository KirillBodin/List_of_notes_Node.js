import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';

describe('NotesController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/notes (GET)', () => {
        return request(app.getHttpServer())
            .get('/notes')
            .expect(200);
    });

    it('/notes/stats (GET)', () => {
        return request(app.getHttpServer())
            .get('/notes/stats')
            .expect(200);
    });

    it('/notes/:id (GET)', () => {
        const noteId = 'b5a03ac9-5a7e-4b79-831f-4e74f07da724';

        return request(app.getHttpServer())
            .get(`/notes/${noteId}`)
            .expect(200);
    });

    it('/notes/:id (GET - Not Found)', () => {
        const nonexistentId = 'b5a03ac9-5a7e-4b79-831f-4e74f07da666';

        return request(app.getHttpServer())
            .get(`/notes/${nonexistentId}`)
            .expect(404);
    });

    it('/notes (POST)', () => {
        const newNote = {
            name: 'New Note',
            category: 'Idea',
            content: 'This is a new note',
            archived: false,
        };

        return request(app.getHttpServer())
            .post('/notes')
            .send(newNote)
            .expect(201);
    });

    it('/notes/:id (PATCH)', () => {
        const noteId = 'b5a03ac9-5a7e-4b79-831f-4e74f07da724';

        const updatedNote = {
            category: 'Task',
            archived: true,
        };

        return request(app.getHttpServer())
            .patch(`/notes/${noteId}`)
            .send(updatedNote)
            .expect(200);
    });

    it('/notes/:id (PATCH - Not Found)', () => {
        const nonexistentId = 'b5a03ac9-5a7e-4b79-831f-4e74f07da666';

        const updatedNote = {
            category: 'Task',
            archived: true,
        };

        return request(app.getHttpServer())
            .patch(`/notes/${nonexistentId}`)
            .send(updatedNote)
            .expect(404);
    });

    it('/notes/:id (DELETE)', () => {
        const noteId = 'b5a03ac9-5a7e-4b79-831f-4e74f07da725';

        return request(app.getHttpServer())
            .delete(`/notes/${noteId}`)
            .expect(200);
    });

    it('/notes/:id (DELETE - Not Found)', () => {
        const nonexistentId = 'b5a03ac9-5a7e-4b79-831f-4e74f07da666';

        return request(app.getHttpServer())
            .delete(`/notes/${nonexistentId}`)
            .expect(404);
    });
});
