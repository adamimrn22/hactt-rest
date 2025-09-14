import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { globalRateLimit } from '@/middleware/rate-limitter.middleware';
import { errorMiddleware } from '@/middleware/error.middleware';
import routes from '@/routes';
import { EmailTransporter } from './utils/email-transporter';

export const createApp = (): express.Application => {
    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(cors(corsOptions));

    // Rate limiting
    app.use(globalRateLimit);

    // Parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Logging
    app.use(morgan('combined'));

    // Routes
    app.use('/api/v1', routes);

    // Health check
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
        });
    });

    const transporter = EmailTransporter.getTransporter();
    transporter.verify((err, success) => {
        if (err) console.error('SMTP Connection Error:', err);
        else console.log('SMTP Server is ready to send emails');
    });

    // Error handling middleware (must be last)
    app.use(errorMiddleware);

    return app;
};
