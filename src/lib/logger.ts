/**
 * 3-Level Logging System
 * 
 * This logger provides three levels of logging:
 * 1. ERROR - Critical errors that should always be logged
 * 2. WARN - Important warnings that might indicate issues
 * 3. INFO - General information for debugging (can be disabled in production)
 * 
 * Usage:
 * import { logger } from '@/lib/logger';
 * logger.error('Critical error occurred', error);
 * logger.warn('Something might be wrong', data);
 * logger.info('Debug information', debugData);
 */

export type LogLevel = 'ERROR' | 'WARN' | 'INFO';

interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  prefix: string;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: (process.env.NODE_ENV === 'development' ? 'INFO' : 'WARN') as LogLevel,
      enabled: process.env.NODE_ENV !== 'test',
      prefix: '[MarketingIAO]',
      ...config
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    
    const levels: Record<LogLevel, number> = {
      ERROR: 3,
      WARN: 2,
      INFO: 1
    };
    
    return levels[level] >= levels[this.config.level];
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `${this.config.prefix} ${level}`;
    
    if (data !== undefined) {
      return `${prefix} [${timestamp}] ${message} ${JSON.stringify(data, null, 2)}`;
    }
    
    return `${prefix} [${timestamp}] ${message}`;
  }

  error(message: string, error?: any): void {
    if (this.shouldLog('ERROR')) {
      const formattedMessage = this.formatMessage('ERROR', message);
      console.error(formattedMessage);
      
      if (error) {
        console.error('Error details:', {
          message: error.message || error,
          stack: error.stack,
          type: error.constructor?.name || typeof error
        });
      }
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('WARN')) {
      const formattedMessage = this.formatMessage('WARN', message, data);
      console.warn(formattedMessage);
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('INFO')) {
      const formattedMessage = this.formatMessage('INFO', message, data);
      console.log(formattedMessage);
    }
  }

  // Utility method for component-specific logging
  debug(component: string, message: string, data?: any): void {
    this.info(`[${component}] ${message}`, data);
  }

  // Set new configuration
  configure(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const logger = new Logger();

// Factory function to create component-specific loggers
export const createLogger = (component: string) => ({
  error: (message: string, error?: any) => logger.error(`[${component}] ${message}`, error),
  warn: (message: string, data?: any) => logger.warn(`[${component}] ${message}`, data),
  info: (message: string, data?: any) => logger.info(`[${component}] ${message}`, data),
  debug: (message: string, data?: any) => logger.debug(component, message, data),
  // Convenience methods for API logging
  apiError: (endpoint: string, error: any) => logger.error(`[${component}] API Error in ${endpoint}`, error),
  apiSuccess: (endpoint: string, data?: any) => logger.info(`[${component}] API Success in ${endpoint}`, data)
});

// Export for testing
export { Logger };