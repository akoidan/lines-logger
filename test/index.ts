'use strict';

import {assert, expect} from 'chai';
import {LoggerFactory, Logger, LogStrict, MockConsole, DoLog} from '../src';

describe('test logger', () => {
  it('should debug with simple text', (done) => {
    const tag = 't1';
    const style = 'color: red';
    const text = 'Hello world!';
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, {
          debug(...args: unknown[]) {
            assert.equal(args[0], `%c${tag}`);
            assert.equal(args[1], style);
            assert.equal(args[2], text);
            expect(args).to.have.length(3);
            done();
          }
        } as MockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.debug(text)();
  });
  it('should log with single param', (done) => {
    const tag = 't1';
    const style = 'color: red';
    const textBefore = 'Hello ';
    const textAfter = '. How\'s it going!';
    const text = `${textBefore}{}${textAfter}`;
    const p1 = {a: 3};
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, {
          error(...args: unknown[]) {
            assert.equal(args[0], `%c${tag}`);
            assert.equal(args[1], style);
            assert.equal(args[2], textBefore);
            assert.equal(args[3], p1);
            assert.equal(args[4], textAfter);
            expect(args).to.have.length(5);
            done();
          }
        } as MockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.error(text, p1)();
  });
  it('should work with multiple params', (done) => {
    const tag = 't1';
    const style = 'color: red';
    const textBefore = 'Hello ';
    const textMiddle = '. How\'s';
    const p2 = ' it ';
    const textAfter = 'going';
    const text = `${textBefore}{}${textMiddle}{}${textAfter}`;
    const p1 = 'Mike';
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, {
          warn(...args: unknown[]) {
            assert.equal(args[0], `%c${tag}`);
            assert.equal(args[1], style);
            assert.equal(args[2], textBefore);
            assert.equal(args[3], p1);
            assert.equal(args[4], textMiddle);
            assert.equal(args[5], p2);
            assert.equal(args[6], textAfter);
            expect(args).to.have.length(7);
            assert.equal(
                args.join(''), '%ct1color: redHello Mike. How\'s it going');
            done();
          }
        } as MockConsole);
    const logger: Logger = loggerFactory.getLogger(tag, style);
    logger.warn(text, p1, p2)();
  });
  it(`Should warn if params are missing and LOG_WITH_WARNINGS`, (done) => {
    let called = false;
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_WITH_WARNINGS, {
          log(...args: unknown[]) {
            assert.equal(args.join('.'), '%ct2.style.<<<.1.===.>>>');
            assert.isTrue(called, 'Error should be called');
            done();
          },
          error(...args: unknown[]) {
            called = true;
          },
        } as MockConsole);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('<<<{}==={}>>>', 1)();
  });
  it('should raise error if params more and LOG_RAISE_ERROR', (done) => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    expect(() => {
      logger.log('<<<{}', 1, 2);
    }).to.throw('MissMatch amount of arguments');
    done();
  });
  it(`Shouldn't warn if warn disabled`, (done) => {
    let called = false;
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.TRACE, {
      error(...args: unknown[]) {
        called = true;
      },
      warn(...args: unknown[]) {
        called = true;
      },
      debug(...args: unknown[]) {
        called = true;
      },
      log(...args: unknown[]) {

      }
    });
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('<<<{}', 1, 2)();
    assert.equal(called, false);
    done();
  });
  it(`shouldn't log if logs are off`, (done) => {
    let called = false;
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.DISABLE_LOGS, {
          error(...args: unknown[]) {
            called = true;
          },
          warn(...args: unknown[]) {
            called = true;
          },
          debug(...args: unknown[]) {
            called = true;
          },
          log(...args: unknown[]) {
            called = true;
          }
        });
    loggerFactory.setLogWarnings(LogStrict.DISABLE_LOGS);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('Hello!')();
    logger.trace('Hello!')();
    logger.warn('Hello!')();
    logger.error('Hello!')();
    logger.debug('Hello!')();
    assert.equal(called, false);
    done();
  });
  it(`should trace if log level is trace`, (done) => {
    let called = false;
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.TRACE, {
      debug(...args: unknown[]) {
        called = true;
      }
    } as MockConsole);
    loggerFactory.setLogWarnings(LogStrict.TRACE);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.trace('Hello!')();
    assert.equal(called, true);
    done();
  });

  it(`should debug if log level is trace`, (done) => {
    let called = false;
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.TRACE, {
      debug(...args: unknown[]) {
        called = true;
      }
    } as MockConsole);
    loggerFactory.setLogWarnings(LogStrict.TRACE);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.debug('Hello!')();
    assert.equal(called, true);
    done();
  });

  it(`shouldn't trace if debug`, (done) => {
    let called = false;
    const loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.DEBUG, {
      error(...args: unknown[]) {
        called = true;
      },
      warn(...args: unknown[]) {
        called = true;
      },
      debug(...args: unknown[]) {
        called = true;
      },
      log(...args: unknown[]) {
        called = true;
      }
    });
    loggerFactory.setLogWarnings(LogStrict.DEBUG);
    const logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.trace('Hello!')();
    assert.equal(called, false);
    done();
  });
  it(`getLoggerColor should work`, (done) => {
    let called = false;
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, {
          log(...args: unknown[]) {
            assert.equal(args[0], '%ctest');
            assert.equal(
                args[1],
                'color: white; background-color: black; padding: 2px 6px; border-radius: 2px; font-size: 10px');
            assert.equal(args[2], 'before ');
            assert.equal(args[3], 1);
            assert.equal(args[4], ' after');

            called = true;
          }
        } as MockConsole);
    /* tslint:disable:no-unused-expression */
    const logger: Logger = loggerFactory.getLoggerColor('test', 'black');
    logger.log('before {} after', 1)();
    expect(called).to.be.true;
    done();
  });
  it(`getSingleLoggerColor should work`, (done) => {
    const loggerFactory: LoggerFactory =
        new LoggerFactory(LogStrict.LOG_RAISE_ERROR, null);
    let called = false;
    const fnLogger: DoLog = loggerFactory.getSingleLoggerColor(
        'test', 'black', (...args: unknown[]) => {
          assert.equal(args[0], '%ctest');
          assert.equal(
              args[1],
              'color: white; background-color: black; padding: 2px 6px; border-radius: 2px; font-size: 10px');
          assert.equal(args[2], '');
          assert.equal(args[3], 1);
          assert.equal(args[4], 2);
          called = true;
        });
    fnLogger('{} 2', 1)();
    /* tslint:disable:no-unused-expression */
    expect(called).to.be.true;
    done();
  });
});
