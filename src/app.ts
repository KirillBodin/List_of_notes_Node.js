import express, {Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import notesRoutes from './routes/notesRoutes';
import morgan from 'morgan';

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

app.use('/notes', notesRoutes);

export default app;
