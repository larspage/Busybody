import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as Sentry from '@sentry/node';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { healthRouter } from './routes/health';
import { tasksRouter } from './routes/tasks';
import { authRouter } from './routes/auth';

const app = express();

// Initialize Sentry if DSN is provided
if (config.sentry.enabled) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.environment,
  });
  // Add Sentry request handler
  app.use(Sentry.Handlers.requestHandler());
}

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/auth', authRouter);

// Error handling
if (config.sentry.enabled) {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.environment} mode`);
});

export default app;