import { Module } from '@nestjs/common';
import { NotesController } from './modules/notes/controllers/notes.controller';
import { NotesService } from './modules/notes/services/notes.service';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
})
export class AppModule {}
