export interface Category {
    name: string;
    active: number;
    archived: number;
}

export interface Note {
    id: string;
    name: string;
    category: string;
    content: string;
    created: string;
    dates: string;
    archived: boolean;
}

export interface NoteDto {
    name: string;
    category: string;
    content: string;
    archived: boolean;
}
