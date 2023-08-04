import {Module} from '@nestjs/common';
import {NotesController} from './notes/controllers/notes.controller';
import {NotesService} from './notes/services/notes.service';

@Module({
    controllers: [NotesController],
    providers: [NotesService],
})
export class NotesModule {
}
