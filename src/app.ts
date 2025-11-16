import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import path from 'path';


const app: Application = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());


const uploadsPath = path.join(__dirname, 'app/uploads');
app.use('/uploads', express.static(uploadsPath));


app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Project is running successfully'
    });
});


app.use(globalErrorHandler);

//This is used for throwing error for unknown routes

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});


export default app;