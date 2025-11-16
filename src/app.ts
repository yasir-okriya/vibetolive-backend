import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import path from 'path';
import fs from 'fs';


const app: Application = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Only serve static uploads in non-serverless environments
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
if (!isServerless) {
    const uploadsPath = path.join(__dirname, 'app/uploads');
    // Check if directory exists before serving static files
    try {
        if (fs.existsSync(uploadsPath)) {
            app.use('/uploads', express.static(uploadsPath));
        }
    } catch (error) {
        console.warn('Uploads directory not available, skipping static file serving:', error);
    }
}


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