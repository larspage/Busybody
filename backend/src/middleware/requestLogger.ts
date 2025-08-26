import { Request, Response, NextFunction } from 'express';
import { Client } from '@axiomhq/js';
import { config } from '../config';

const axiomClient = config.axiom.token
  ? new Client({
      token: config.axiom.token,
      orgId: config.axiom.dataset,
    })
  : null;

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Capture response data after request is finished
  res.on('finish', () => {
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: Date.now() - startTime,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      timestamp: new Date().toISOString(),
    };

    // Log to console in development
    if (config.environment === 'development') {
      console.log(JSON.stringify(logData, null, 2));
    }

    // Send to Axiom if configured
    if (axiomClient && config.axiom.dataset) {
      axiomClient.ingest(config.axiom.dataset, [logData]).catch((err) => {
        console.error('Error sending logs to Axiom:', err);
      });
    }
  });

  next();
};