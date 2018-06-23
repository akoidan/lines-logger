export interface Logger {
  warn(format: String, ...args: any[]): Function;
  log(format: String, ...args: any[]): Function;
  error(format: String, ...args: any[]): Function;
  debug(format: String, ...args: any[]): Function;
}

export class LoggerFactory {

  private logsEnabled: boolean;

  constructor(logsEnabled: boolean = true) {
    this.logsEnabled = logsEnabled;
  }

  private dummy() {

  }


  public getSingleLoggerColor(initiator: string, color: string, fn: Function) {
    return this.getSingleLogger(initiator, this.getColorStyle(color), fn);
  }

  public getSingleLogger(initiator: string, style: string, fn: Function) {
    return (...args1: any[]) => {
      if (!this.logsEnabled) {
        return this.dummy;
      }
      let args = Array.prototype.slice.call(args1);
      let parts = args.shift().split('{}');
      let params = [window.console, '%c' + initiator, style];
      for (let i = 0; i < parts.length; i++) {
        params.push(parts[i]);
        if (typeof args[i] !== 'undefined') { // args can be '0'
          params.push(args[i]);
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
      warn: this.getSingleLogger(initiator, style, console.warn),
      log: this.getSingleLogger(initiator, style, console.log),
      error: this.getSingleLogger(initiator, style, console.error),
      debug: this.getSingleLogger(initiator, style, console.debug)
    };
  }
}

