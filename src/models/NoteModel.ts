import {Model, DataTypes, Optional} from 'sequelize';
import sequelize from '../config/database';

interface NoteAttributes {
    id: string;
    name: string;
    category: string;
    content: string;
    archived: boolean;
    created: string;
    dates: string;
}

interface NoteCreationAttributes extends Optional<NoteAttributes, 'id'> {
}

class NoteModel extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
    public id!: string;
    public name!: string;
    public category!: string;
    public content!: string;
    public archived!: boolean;
    public created!: string;
    public dates!: string;
}

NoteModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        archived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        created: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        dates: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: 'notes',
        sequelize,
    }
);

export default NoteModel;
