'use strict';

import {assert, expect, use} from 'chai';
import {LoggerFactory, Logger, LogStrict, MockConsole, DoLog} from '../src';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
import {SinonSandbox, SinonSpy} from 'sinon';

use(sinonChai);
/* tslint:disable:no-unused-expression */
describe('test logger', () => {
  let mockConsole: MockConsole ;
  let spyError: SinonSpy<unknown[], void> ;
  let spyWarning: SinonSpy<unknown[], void> ;
  let spyDebug: SinonSpy<unknown[], void>;
  let spyLog: SinonSpy<unknown[], void>;

  beforeEach(() => {
    mockConsole = new (class implements MockConsole {
      debug(message?: unknown, ...optionalParams: unknown[]): void {
        console.log(`calling debug message: ${message} params: ${optionalParams.join(',')}`);
      }

      error(message?: unknown, ...optionalParams: unknown[]): void {
        console.log(`calling error message: ${message} params: ${optionalParams.join(',')}`);
      }

      log(message?: unknown, ...optionalParams: unknown[]): void {
        console.log(`calling log message: ${message} params: ${optionalParams.join(',')}`);
      }

      warn(message?: unknown, ...optionalParams: unknown[]): void {
        console.log(`calling warn message: ${message} params: ${optionalParams.join(',')}`);
      }
    })();
    spyDebug = sinon.spy(mockConsole, `debug`);
    spyWarning = sinon.spy(mockConsole, `warn`);
    spyLog = sinon.spy(mockConsole, `log`);
    spyError = sinon.spy(mockConsole, `error`);
  });

  afterEach(() => {
    spyError.restore();
    spyWarning.restore();
    spyDebug.restore();
    spyLog.restore();
  });

  it('should debug with simple text', () => {
    const tag = 't1';
    const style = 'color: red';
    const text = 'Hello world!';
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, mockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.debug(text)();
    expect(spyDebug).to.have.been.calledOnceWithExactly(`%c${tag}`, style, text);
  });
  it('should log with single param', () => {
    const tag = 't1';
    const style = 'color: red';
    const textBefore = 'Hello ';
    const textAfter = '. How\'s it going!';
    const text = `${textBefore}{}${textAfter}`;
    const p1 = {a: 3};
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, mockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.error(text, p1)();
    expect(spyError).to.have.been.calledOnceWithExactly(`%c${tag}`, style, textBefore, p1, textAfter);
  });
  it('should work with multiple params', () => {
    const tag = 't1';
    const style = 'color: red';
    const textBefore = 'Hello ';
    const textMiddle = '. How\'s';
    const p2 = ' it ';
    const textAfter = 'going';
    const text = `${textBefore}{}${textMiddle}{}${textAfter}`;
    const p1 = 'Mike';
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, mockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.warn(text, p1, p2)();
    expect(spyWarning).to.have.been.calledOnceWithExactly(`%c${tag}`, style, textBefore, p1, textMiddle, p2,  textAfter);
  });
  it(`Should warn if params are missing and LOG_WITH_WARNINGS`, () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_WITH_WARNINGS, mockConsole);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('<<<{}==={}>>>', 1)();
    expect(spyLog).to.have.been.calledOnceWithExactly(`%ct2`, 'style', '<<<', 1, '===', '>>>');
    expect(spyError).to.have.been.calledOnce;
  });
  it('should raise error if params more and LOG_RAISE_ERROR', () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    expect(() => {
      logger.log('<<<{}', 1, 2);
    }).to.throw('MissMatch amount of arguments');
  });
  it(`Shouldn't warn if warn disabled`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.TRACE, mockConsole);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('<<<{}', 1, 2)();
    sinon.assert.notCalled(spyDebug);
    sinon.assert.notCalled(spyError);
    sinon.assert.notCalled(spyWarning);
    expect(spyLog).to.have.been.calledOnce;
  });
  it(`shouldn't log if logs are off`, () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.DISABLE_LOGS, mockConsole);

    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('Hello!')();
    logger.trace('Hello!')();
    logger.warn('Hello!')();
    logger.error('Hello!')();
    logger.debug('Hello!')();
    sinon.assert.notCalled(spyError);
    sinon.assert.notCalled(spyDebug);
    sinon.assert.notCalled(spyWarning);
    sinon.assert.notCalled(spyLog);
  });
  it(`should trace if log level is trace`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.TRACE, mockConsole);
    loggerFactory.setLogWarnings(LogStrict.TRACE);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.trace('Hello!')();
    expect(spyDebug).to.have.been.calledOnce;
  });

  it(`should debug if log level is trace`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.TRACE, mockConsole);
    loggerFactory.setLogWarnings(LogStrict.TRACE);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.debug('Hello!')();
    expect(spyDebug).to.have.been.calledOnce;
  });

  it(`shouldn't trace if debug`, () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.DEBUG, mockConsole);

    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.trace('Hello!')();
    sinon.assert.notCalled(spyError);
    sinon.assert.notCalled(spyDebug);
    sinon.assert.notCalled(spyWarning);
    sinon.assert.notCalled(spyLog);
  });
  it(`getLoggerColor should work`, () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, mockConsole);
    
    const logger: Logger = loggerFactory.getLoggerColor('test', 'black');
    logger.log('before {} after', 1)();
    expect(spyLog).to.have.been.calledOnceWithExactly(`%ctest`, 'color: white; background-color: black; padding: 2px 6px; border-radius: 2px; font-size: 10px', 'before ', 1, ' after');
  });
  it(`getSingleLoggerColor should work`, () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, null);

    const cb = sinon.spy();
    const fnLogger: DoLog = loggerFactory.getSingleLoggerColor(
        'test', 'black', cb);
    fnLogger('{} 2', 1)();
    expect(cb).to.have.been.calledOnceWithExactly(`%ctest`, 'color: white; background-color: black; padding: 2px 6px; border-radius: 2px; font-size: 10px', '', 1, ' 2');
  });
  it(`Default log level should be set`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory();
    expect(loggerFactory.getLogWarnings())
        .to.be.equal(LogStrict.LOG_WITH_WARNINGS);
  });
  it(`Exception should be throw on invalid level`, () => {
    expect(() => {
      const loggerFactory: LoggerFactory = new LoggerFactory(-1);
    }).to.throw(/Invalid log level -1/);
  });
});
