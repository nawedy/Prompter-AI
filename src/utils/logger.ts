import { createLogger, format, transports } from 'winston';

// Create custom format for structured logging
const customFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.metadata(),
  format.json()
);

// Create logger instance
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: customFormat,
  defaultMeta: { service: 'prompter-ai' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    ),
  }));
}

// Create specialized loggers
export const appLogger = {
  info: (message: string, meta?: Record<string, any>) => {
    logger.info(message, { ...meta, timestamp: new Date().toISOString() });
  },
  error: (error: Error, context?: Record<string, any>) => {
    logger.error(error.message, {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      timestamp: new Date().toISOString(),
    });
  },
  warn: (message: string, meta?: Record<string, any>) => {
    logger.warn(message, { ...meta, timestamp: new Date().toISOString() });
  },
  debug: (message: string, meta?: Record<string, any>) => {
    logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
  },
  audit: (action: string, userId: string, details: Record<string, any>) => {
    logger.info(`Audit: ${action}`, {
      audit: true,
      userId,
      details,
      timestamp: new Date().toISOString(),
    });
  },
  performance: (operation: string, duration: number, meta?: Record<string, any>) => {
    logger.info(`Performance: ${operation}`, {
      performance: true,
      duration,
      ...meta,
      timestamp: new Date().toISOString(),
    });
  },
};