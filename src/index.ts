export interface Logger {
  warn(format: String, ...args: any[]): Function;
  log(format: String, ...args: any[]): Function;
  error(format: String, ...args: any[]): Function;
  debug(format: String, ...args: any[]): Function;
  trace(format: String, ...args: any[]): Function;
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

export class LoggerFactory {

  private logWarnings: LogStrict;
  private mockConsole: Console;

  constructor(logWarnings: LogStrict = LogStrict.LOG_WITH_WARNINGS, mockConsole: Console = null) {
    this.logWarnings = logWarnings;
    if (mockConsole) {
      this.mockConsole = mockConsole;
    } else {
      this.mockConsole = console;
    }
  }

  private dummy() {

  }

  public setLogWarnings(logWarnings: LogStrict) {
    this.logWarnings = logWarnings;
  }


  public getSingleLoggerColor(initiator: string, color: string, fn: Function) {
    return this.getSingleLogger(initiator, this.getColorStyle(color), fn);
  }

  public getSingleLogger(initiator: string, style: string, fn: Function, min_level: LogStrict = LogStrict.LOG_WITH_WARNINGS) {
    return (...args1: any[]) => {
      if (this.logWarnings > min_level) {
        return this.dummy;
      }
      let args = Array.prototype.slice.call(args1);
      let parts = args.shift().split('{}');
      let params = [this.mockConsole, '%c' + initiator, style];
      for (let i = 0; i < parts.length; i++) {
        params.push(parts[i]);
        if (typeof args[i] !== 'undefined') { // args can be '0'
          params.push(args[i]);
        }
      }
      if (parts.length -1 != args.length) {
        if (this.logWarnings === LogStrict.LOG_WITH_WARNINGS) {
          this.mockConsole.error("MissMatch amount of arguments")
        } else if (this.logWarnings === LogStrict.LOG_RAISE_ERROR) {
          throw "MissMatch amount of arguments";
        }
      }
      return Function.prototype.bind.apply(fn, params);
    };
  }

  public getLoggerColor(initiator: string, color: string): Logger {
    return this.getLogger(initiator, this.getColorStyle(color));
  }

  public getColorStyle(color: string) {
    return `color: white; background-color: ${color}; padding: 2px 6px; border-radius: 2px; font-size: 10px`;
  }

  public getLogger(initiator: string, style: string): Logger {
    return {
      trace: this.getSingleLogger(initiator, style, this.mockConsole.debug, LogStrict.TRACE),
      debug: this.getSingleLogger(initiator, style, this.mockConsole.debug, LogStrict.DEBUG),
      log: this.getSingleLogger(initiator, style, this.mockConsole.log, LogStrict.INFO),
      warn: this.getSingleLogger(initiator, style, this.mockConsole.warn, LogStrict.WARN),
      error: this.getSingleLogger(initiator, style, this.mockConsole.error, LogStrict.ERROR),
    };
  }
}

