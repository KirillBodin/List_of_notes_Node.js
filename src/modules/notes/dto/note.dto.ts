import { IsString, IsNotEmpty, IsIn, IsBoolean, IsOptional } from 'class-validator';

export class NoteDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['Quote', 'Idea', 'Task', 'Random Thought'])
    category: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsBoolean()
    archived: boolean;

    @IsOptional()
    @IsString()
    id?: string;
}