import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { healthRouter } from './routes/health';

const app = express();

// Initialize Sentry
Sentry.init({
  dsn: config.sentry.dsn,
  environment: config.environment,
});

// Middleware
app.use(Sentry.Handlers.requestHandler());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);

// Error handling
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.environment} mode`);
});

export default app;