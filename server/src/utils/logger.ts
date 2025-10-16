export interface LogContext {
  [key: string]: any;
}

class Logger {
  info(message: string, context?: LogContext) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, context || '');
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  }

  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, context || '');
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, context || '');
    }
  }
}

export const logger = new Logger();
