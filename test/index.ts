'use strict';

import {assert, expect, use} from 'chai';
import {LoggerFactory, Logger, LogStrict, MockConsole, DoLog} from '../src';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
import {SinonSandbox, SinonSpy} from 'sinon';

use(sinonChai);
/* tslint:disable:no-unused-expression */
describe('test logger', () => {
  let spy: SinonSpy<unknown[], void> | null;
  beforeEach(() => {
    spy = null;
  });

  afterEach(() => {
    if (spy) {
      spy.restore();
    }
  });

  const mockConsole: MockConsole = new (class implements MockConsole {
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
  it('should debug with simple text', () => {
    const tag = 't1';
    const style = 'color: red';
    const text = 'Hello world!';
    spy = sinon.spy(mockConsole, `debug`);
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, mockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.debug(text)();
    expect(spy).to.have.been.calledOnceWithExactly(`%c${tag}`, style, text);
  });
  it('should log with single param', () => {
    const tag = 't1';
    const style = 'color: red';
    const textBefore = 'Hello ';
    const textAfter = '. How\'s it going!';
    const text = `${textBefore}{}${textAfter}`;
    const p1 = {a: 3};
    spy = sinon.spy(mockConsole, `error`);
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, mockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.error(text, p1)();
    expect(spy).to.have.been.calledOnceWithExactly(`%c${tag}`, style, textBefore, p1, textAfter);
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
    spy = sinon.spy(mockConsole, `warn`);
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, mockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.warn(text, p1, p2)();
    expect(spy).to.have.been.calledOnceWithExactly(`%c${tag}`, style, textBefore, p1, textMiddle, p2,  textAfter);
  });
  it(`Should warn if params are missing and LOG_WITH_WARNINGS`, () => {
    spy = sinon.spy(mockConsole, `log`);
    const spy2 = sinon.spy(mockConsole, `error`);
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_WITH_WARNINGS, mockConsole);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('<<<{}==={}>>>', 1)();
    
    expect(spy).to.have.been.calledOnceWithExactly(`%ct2`, 'style', '<<<', 1, '===', '>>>');
    expect(spy2).to.have.been.calledOnce;
    spy2.restore();
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
    const spy1 = sinon.spy(mockConsole, 'error');
    const spy2 = sinon.spy(mockConsole, 'warn');
    const spy3 = sinon.spy(mockConsole, 'debug');
    const spy4 = sinon.spy(mockConsole, 'log');
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('<<<{}', 1, 2)();
    sinon.assert.notCalled(spy1);
    sinon.assert.notCalled(spy2);
    sinon.assert.notCalled(spy3);
    expect(spy4).to.have.been.calledOnce;
    spy1.restore();
    spy2.restore();
    spy3.restore();
    spy4.restore();
  });
  it(`shouldn't log if logs are off`, () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.DISABLE_LOGS, mockConsole);

    const spy1 = sinon.spy(mockConsole, 'error');
    const spy2 = sinon.spy(mockConsole, 'warn');
    const spy3 = sinon.spy(mockConsole, 'debug');
    const spy4 = sinon.spy(mockConsole, 'log');
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('Hello!')();
    logger.trace('Hello!')();
    logger.warn('Hello!')();
    logger.error('Hello!')();
    logger.debug('Hello!')();
    sinon.assert.notCalled(spy1);
    sinon.assert.notCalled(spy2);
    sinon.assert.notCalled(spy3);
    sinon.assert.notCalled(spy4);
    spy1.restore();
    spy2.restore();
    spy3.restore();
    spy4.restore();
  });
  it(`should trace if log level is trace`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.TRACE, mockConsole);
    spy = sinon.spy(mockConsole, 'debug');
    loggerFactory.setLogWarnings(LogStrict.TRACE);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.trace('Hello!')();
    expect(spy).to.have.been.calledOnce;
  });

  it(`should debug if log level is trace`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.TRACE, mockConsole);
    spy = sinon.spy(mockConsole, 'debug');
    loggerFactory.setLogWarnings(LogStrict.TRACE);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.debug('Hello!')();
    expect(spy).to.have.been.calledOnce;
  });

  it(`shouldn't trace if debug`, () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.DEBUG, mockConsole);
    const spy1 = sinon.spy(mockConsole, 'error');
    const spy2 = sinon.spy(mockConsole, 'warn');
    const spy3 = sinon.spy(mockConsole, 'debug');
    const spy4 = sinon.spy(mockConsole, 'log');
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.trace('Hello!')();
    sinon.assert.notCalled(spy1);
    sinon.assert.notCalled(spy2);
    sinon.assert.notCalled(spy3);
    sinon.assert.notCalled(spy4);
    spy1.restore();
    spy2.restore();
    spy3.restore();
    spy4.restore();
  });
  it(`getLoggerColor should work`, () => {
    spy = sinon.spy(mockConsole, 'log');
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, mockConsole);
    
    const logger: Logger = loggerFactory.getLoggerColor('test', 'black');
    logger.log('before {} after', 1)();
    expect(spy).to.have.been.calledOnceWithExactly(`%ctest`, 'color: white; background-color: black; padding: 2px 6px; border-radius: 2px; font-size: 10px', 'before ', 1, ' after');
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
});
