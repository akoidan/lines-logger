export interface Logger {
  warn: DoLog;
  log: DoLog;
  error: DoLog;
  debug: DoLog;
  trace: DoLog;
}

export interface DoLog {
  (format: string, ...args: unknown[]): () => void;
}

export enum LogStrict {
  LOG_RAISE_ERROR = 1,
  LOG_WITH_WARNINGS = 2,
  TRACE = 3,
  DEBUG = 4,
  INFO = 5,
  WARN = 6,
  ERROR = 7,
  DISABLE_LOGS = 8
}

export interface MockConsole {
  debug(message?: unknown, ...optionalParams: unknown[]): void;

  log(message?: unknown, ...optionalParams: unknown[]): void;

  error(message?: unknown, ...optionalParams: unknown[]): void;

  warn(message?: unknown, ...optionalParams: unknown[]): void;
}

export class LoggerFactory {
  private logWarnings: LogStrict;
  private mockConsole: MockConsole;

  constructor(
      logWarnings: LogStrict = LogStrict.LOG_WITH_WARNINGS,
      mockConsole: MockConsole|null = null) {
    this.logWarnings = logWarnings;
    if (mockConsole) {
      this.mockConsole = mockConsole;
    } else {
      this.mockConsole = console;
    }
  }

  private dummy() {}

  setLogWarnings(logWarnings: LogStrict): void {
    this.logWarnings = logWarnings;
  }

  getLogWarnings(): LogStrict {
    return this.logWarnings;
  }

  getSingleLoggerColor(initiator: string, color: string, fn: Function): DoLog {
    return this.getSingleLogger(initiator, this.getColorStyle(color), fn);
  }

  getSingleLogger(
      initiator: string, style: string, fn: Function,
      minLevel: LogStrict = LogStrict.LOG_WITH_WARNINGS): DoLog {
    return (...args1: unknown[]) => {
      if (this.logWarnings > minLevel) {
        return this.dummy;
      }
      const args = Array.prototype.slice.call(args1);
      const parts = args.shift().split('{}');
      /* tslint:disable:no-any */
      // TODO
      const params: any[any] = [this.mockConsole, '%c' + initiator, style];
      /* tslint:enable:no-any */
      for (let i = 0; i < parts.length; i++) {
        params.push(parts[i]);
        if (typeof args[i] !== 'undefined') {  // args can be '0'
          params.push(args[i]);
        }
      }
      if (parts.length - 1 !== args.length) {
        if (this.logWarnings === LogStrict.LOG_WITH_WARNINGS) {
          this.mockConsole.error('MissMatch amount of arguments');
        } else if (this.logWarnings === LogStrict.LOG_RAISE_ERROR) {
          throw new Error('MissMatch amount of arguments');
        }
      }
      return Function.prototype.bind.apply(fn, params);
    };
  }

  getLoggerColor(initiator: string, color: string): Logger {
    return this.getLogger(initiator, this.getColorStyle(color));
  }

  getColorStyle(color: string): string {
    return `color: white; background-color: ${
        color}; padding: 2px 6px; border-radius: 2px; font-size: 10px`;
  }

  getLogger(initiator: string, style: string): Logger {
    return {
      trace: this.getSingleLogger(
          initiator, style, this.mockConsole.debug, LogStrict.TRACE),
      debug: this.getSingleLogger(
          initiator, style, this.mockConsole.debug, LogStrict.DEBUG),
      log: this.getSingleLogger(
          initiator, style, this.mockConsole.log, LogStrict.INFO),
      warn: this.getSingleLogger(
          initiator, style, this.mockConsole.warn, LogStrict.WARN),
      error: this.getSingleLogger(
          initiator, style, this.mockConsole.error, LogStrict.ERROR),
    };
  }
}
