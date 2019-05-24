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

/**
 * Logging levels
 *
 */
export enum LogStrict {

  /**
   * Log all, raise an error if mismatch amount of arguments
   */
  LOG_RAISE_ERROR = 1,

  /**
   * Log all, print a warning when mismatch amount of arguments
   */
  LOG_WITH_WARNINGS = 2,

  /**
   * Log all
   */
  TRACE = 3,

  /**
   * Hide: trace
   * Print: debug, info, warn, error
   */
  DEBUG = 4,
  /**
   * Print: info, warn, error
   * Hide: trace, debug
   */
  INFO = 5,
  /**
   * Print: warn, error
   * Hide: trace, debug, info
   */
  WARN = 6,
  /**
   * Print: error
   * Hide: trace, debug, info, warn
   */
  ERROR = 7,
  /**
   * Completely disable all loggin functions
   */
  DISABLE_LOGS = 8
}

export interface MockConsole {
  debug(message?: unknown, ...optionalParams: unknown[]): void;

  log(message?: unknown, ...optionalParams: unknown[]): void;

  error(message?: unknown, ...optionalParams: unknown[]): void;

  warn(message?: unknown, ...optionalParams: unknown[]): void;
}

/**
 * Factory class for {@see Logger}
 */
export class LoggerFactory {
  /**
   * Current logging level
   */
  private logWarnings: LogStrict;

  /**
   * Current console that's triggered
   */
  private mockConsole: MockConsole;


  /**
   * @param logWarnings - initial logging level
   * @param mockConsole - console object that will be triggered, default to `window.console`
   */
  constructor(
      logWarnings: LogStrict = LogStrict.LOG_WITH_WARNINGS,
      mockConsole: MockConsole|null = null) {
    this.logWarnings = logWarnings;
    if (!LogStrict[logWarnings]) {
      throw Error(`Invalid log level ${logWarnings} allowed:  ${JSON.stringify(LogStrict)}`);
    }
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

  /**
   * @return Single log function that can be called, e.g. getSingleLogger(...)('hello wolrd')
   * @param initiator - badge string, that every log will be marked with
   * @param color - css color of badge, e.g. #FFFAAA
   * @param fn - binded function that will be called eventually, e.g. console.log
   */
  getSingleLoggerColor(initiator: string, color: string, fn: Function): DoLog {
    return this.getSingleLogger(initiator, this.getColorStyle(color), fn);
  }

  /**
   * @return Single log function that can be called, e.g. getSingleLogger(...)('hello wolrd')
   * @param fn - binded function that will be called eventually, e.g. console.log
   * @param initiator - badge string, that every log will be marked with
   * @param minLevel - initial logging level, .e.g 2
   * @param style - css style, e.g. `font-size: 10px; border-color: red`
   */
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

  /**
   * @return logger with badged tag
   * @param initiator - badge string, that every log will be marked with
   * @param color - css color of badge, e.g. #FFFAAA
   */
  getLoggerColor(initiator: string, color: string): Logger {
    return this.getLogger(initiator, this.getColorStyle(color));
  }

  /**
   * @return css for badge
   * @param color - css color, e.g. #FFFAAA
   */
  getColorStyle(color: string): string {
    return `color: white; background-color: ${
        color}; padding: 2px 6px; border-radius: 2px; font-size: 10px`;
  }

  /**
   * @return a logger object
   * @param initiator - badge string, that every log will be marked with
   * @param style - css style, e.g. `font-size: 10px; border-color: red`
   */
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
