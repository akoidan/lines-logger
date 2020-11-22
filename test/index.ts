'use strict';

import {
  expect,
  use
} from 'chai';
import {
  DoLog,
  Logger,
  LoggerFactory,
  MockConsole
} from '../src';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
import { SinonSpy } from 'sinon';

use(sinonChai);
/* tslint:disable:no-unused-expression */
describe('logger', () => {
  let mockConsole: MockConsole;
  let spyError: SinonSpy<unknown[], void>;
  let spyWarning: SinonSpy<unknown[], void>;
  let spyDebug: SinonSpy<unknown[], void>;
  let spyTrace: SinonSpy<unknown[], void>;
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
      trace(message?: unknown, ...optionalParams: unknown[]): void {
        console.log(`calling trace message: ${message} params: ${optionalParams.join(',')}`);
      }
    })();
    spyTrace = sinon.spy(mockConsole, `trace`);
    spyDebug = sinon.spy(mockConsole, `debug`);
    spyWarning = sinon.spy(mockConsole, `warn`);
    spyLog = sinon.spy(mockConsole, `log`);
    spyError = sinon.spy(mockConsole, `error`);
  });

  afterEach(() => {
    spyError.restore();
    spyWarning.restore();
    spyDebug.restore();
    spyTrace.restore();
    spyLog.restore();
  });

  it('should debug with simple text', () => {
    const tag = 't1';
    const style = 'color: red';
    const text = 'Hello world!';
    const loggerFactory: LoggerFactory = new LoggerFactory('log_raise_error', mockConsole);
    const logger: Logger = loggerFactory.getLoggerStyle(tag, style);
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
    const loggerFactory: LoggerFactory = new LoggerFactory('log_raise_error', mockConsole);
    const logger: Logger = loggerFactory.getLoggerStyle(tag, style);
    logger.error(text, p1)();
    expect(spyError).to.have.been.calledOnceWithExactly(
        `%c${tag}`,
        style,
        textBefore,
        p1,
        textAfter
    );
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
    const loggerFactory: LoggerFactory = new LoggerFactory('log_raise_error', mockConsole);
    const logger: Logger = loggerFactory.getLoggerStyle(tag, style);
    logger.warn(text, p1, p2)();
    expect(spyWarning).to.have.been.calledOnceWithExactly(
        `%c${tag}`,
        style,
        textBefore,
        p1,
        textMiddle,
        p2,
        textAfter
    );
  });
  it(`should warn if params are missing and LOG_WITH_WARNINGS`, () => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory('log_with_warnings', mockConsole);
    const logger: Logger = loggerFactory.getLoggerStyle('t2', 'style');
    logger.log('<<<{}==={}>>>', 1)();
    expect(spyLog).to.have.been.calledOnceWithExactly(
        `%ct2`, 'style', '<<<', 1, '===', '>>>');
    expect(spyError).to.have.been.calledOnce;
  });
  it('should raise an error if params more and LOG_RAISE_ERROR', () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('log_raise_error');
    const logger: Logger = loggerFactory.getLoggerStyle('t2', 'style');
    expect(() => {
      logger.log('<<<{}', 1, 2);
    }).to.throw('MissMatch amount of arguments');
  });
  it(`shouldn't warn if warn disabled`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('trace', mockConsole);
    const logger: Logger = loggerFactory.getLoggerStyle('t2', 'style');
    logger.log('<<<{}', 1, 2)();
    sinon.assert.notCalled(spyDebug);
    sinon.assert.notCalled(spyError);
    sinon.assert.notCalled(spyWarning);
    expect(spyLog).to.have.been.calledOnce;
  });
  it(`shouldn't log if logs are off`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('disable', mockConsole);

    const logger: Logger = loggerFactory.getLoggerStyle('t2', 'style');
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
    const loggerFactory: LoggerFactory = new LoggerFactory('trace', mockConsole);
    loggerFactory.setLogWarnings('trace');
    const logger: Logger = loggerFactory.getLoggerStyle('t2', 'style');
    logger.trace('Hello!')();
    expect(spyTrace).to.have.been.calledOnce;
  });

  it(`should debug if log level is trace`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('trace', mockConsole);
    loggerFactory.setLogWarnings('trace');
    const logger: Logger = loggerFactory.getLoggerStyle('t2', 'style');
    logger.debug('Hello!')();
    expect(spyDebug).to.have.been.calledOnce;
  });

  it(`shouldn't trace if debug`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('debug', mockConsole);

    const logger: Logger = loggerFactory.getLoggerStyle('t2', 'style');
    logger.trace('Hello!')();
    sinon.assert.notCalled(spyError);
    sinon.assert.notCalled(spyDebug);
    sinon.assert.notCalled(spyWarning);
    sinon.assert.notCalled(spyLog);
  });
  it(`should log if getLoggerColor api was used`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('log_raise_error', mockConsole);

    const logger: Logger = loggerFactory.getLoggerColor('test', 'black');
    logger.log('before {} after', 1)();
    expect(spyLog).to.have.been.calledOnceWithExactly(
        `%ctest`,
        'color: white; background-color: black; padding: 2px 6px; border-radius: 2px; font-size: 10px',
        'before ',
        1,
        ' after'
    );
  });
  it(`should log if getSingleLoggerColor api was used`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('log_raise_error', null);

    const cb = sinon.spy();
    const fnLogger: DoLog = loggerFactory.getSingleLoggerColor('test', 'black', cb);
    fnLogger('{} 2', 1)();
    expect(cb).to.have.been.calledOnceWithExactly(
        `%ctest`,
        'color: white; background-color: black; padding: 2px 6px; border-radius: 2px; font-size: 10px',
        '',
        1,
        ' 2'
    );
  });
  it(`should log if getSingleLogger api was used`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('log_raise_error', null);

    const cb = sinon.spy();
    const fnLogger: DoLog = loggerFactory.getSingleLogger('test', cb);
    fnLogger('{} 2', 1)();
    expect(cb).to.have.been.calledOnceWithExactly(
        `%ctest`,
        'color: white; background-color: #514b6b; padding: 2px 6px; border-radius: 2px; font-size: 10px',
        '',
        1,
        ' 2'
    );
  });
  it(`should have default log level set`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory();
    expect(loggerFactory.getLogWarnings()).to.be.equal('log_with_warnings');
  });
  it(`should throw an error if invalid level was passed`, () => {
    expect(() => {
      // @ts-expect-error
      const loggerFactory: LoggerFactory = new LoggerFactory('nonexistedlevel');
    }).to.throw(/Invalid log level nonexistedlevel/);
  });
  it(`should generate dark colors despite the hash of the tag`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory();
    expect(loggerFactory.getRandomColor()).to.be.equal('#0b2342');
    expect(loggerFactory.getRandomColor('')).to.be.equal('#0b2342');
    expect(loggerFactory.getRandomColor('1')).to.be.equal('#505471');
    expect(loggerFactory.getRandomColor('a')).to.be.equal('#097a2d');
    expect(loggerFactory.getRandomColor('A')).to.be.equal('#850a30');
    expect(loggerFactory.getRandomColor('Z')).to.be.equal('#7b5813');
    expect(loggerFactory.getRandomColor('z')).to.be.equal('#0e2e14');
    expect(loggerFactory.getRandomColor('ws')).to.be.equal('#41093a');
    expect(loggerFactory.getRandomColor('ff')).to.be.equal('#18756d');
  });
  it(`should generate different hashes in input`, () => {
    expect(LoggerFactory.getHash('')).to.be.equal(3338908027751811);
    expect(LoggerFactory.getHash('', 2)).to.be.equal(2130661745665215);
    expect(LoggerFactory.getHash('a')).to.be.equal(7929297801672961);
    expect(LoggerFactory.getHash('aff1HF:')).to.be.equal(7665633949954318);
    expect(LoggerFactory.getHash('GS*)c6dsf1Fd')).to.be.equal(5906162519488434);
  });
  it(`should work if getLogger was called w/o style`, () => {
    const loggerFactory: LoggerFactory = new LoggerFactory('debug', mockConsole);
    const logger: Logger = loggerFactory.getLogger('test');
    logger.log('print message')()

    expect(spyLog).to.have.been.calledOnce;
    expect(spyLog).to.have.been.calledOnceWithExactly(
        `%ctest`,
        'color: white; background-color: #514b6b; padding: 2px 6px; border-radius: 2px; font-size: 10px',
        'print message'
    );
  });
});
