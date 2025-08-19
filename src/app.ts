import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { getAllModelsData } from './controllers/dump';

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(routes);
// Для теста
app.get('/api/models', getAllModelsData);

export { app };
