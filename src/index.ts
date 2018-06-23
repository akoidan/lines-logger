export interface Logger {
  warn(format: String, ...args: any[]): Function;
  log(format: String, ...args: any[]): Function;
  error(format: String, ...args: any[]): Function;
  debug(format: String, ...args: any[]): Function;
}

export enum LogStrict {
  DISABLE_LOGS = 0,
  LOG_WITHOUT_WARNINGS = 1,
  LOG_WITH_WARNINGS = 2,
  LOG_RAISE_ERROR = 3
}

export class LoggerFactory {

  private logWarnings: LogStrict;
  private mockConsole: Console;

  constructor(logWarnings: LogStrict = 2, mockConsole: Console = null) {
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

  public getSingleLogger(initiator: string, style: string, fn: Function) {
    return (...args1: any[]) => {
      if (this.logWarnings === LogStrict.DISABLE_LOGS) {
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
      warn: this.getSingleLogger(initiator, style, this.mockConsole.warn),
      log: this.getSingleLogger(initiator, style, this.mockConsole.log),
      error: this.getSingleLogger(initiator, style, this.mockConsole.error),
      debug: this.getSingleLogger(initiator, style, this.mockConsole.debug)
    };
  }
}

