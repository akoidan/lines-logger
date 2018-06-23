'use strict';

import {assert, expect} from 'chai';
import {LoggerFactory, Logger, LogStrict} from '../src';

describe('test logger', function () {
  it('should debug with simple text', function (done) {
    let tag = 't1'
    let style = 'color: red'
    let text = "Hello world!"
    let loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.LOG_WITH_WARNINGS,<any>{
      debug: function(...args: any[]){
        assert.equal(args[0], `%c${tag}`);
        assert.equal(args[1], style);
        assert.equal(args[2], text);
        expect(args).to.have.length(3);
        done()
      }
    });
    let logger: Logger = loggerFactory.getLogger(tag, style);
    logger.debug(text)();
  });
  it('should log with single param', function (done) {
    let tag = 't1'
    let style = 'color: red'
    let textBefore = "Hello "
    let textAfter = ". How's it going!"
    let text = `${textBefore}{}${textAfter}`
    let p1 = {a: 3};
    let loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.LOG_WITH_WARNINGS, <any>{
      error: function(...args: any[]){
        assert.equal(args[0], `%c${tag}`);
        assert.equal(args[1], style);
        assert.equal(args[2], textBefore);
        assert.equal(args[3], p1);
        assert.equal(args[4], textAfter);
        expect(args).to.have.length(5);
        done()
      }
    });
    let logger: Logger = loggerFactory.getLogger(tag, style);
    logger.error(text, p1)();
  });
  it('should work with multiple params', function (done) {
    let tag = 't1';
    let style = 'color: red';
    let textBefore = "Hello ";
    let textMiddle = ". How's";
    let p2 = " it ";
    let textAfter = "going";
    let text = `${textBefore}{}${textMiddle}{}${textAfter}`
    let p1 = 'Mike';
    let loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.LOG_WITH_WARNINGS, <any>{
      warn: function(...args: any[]){
        assert.equal(args[0], `%c${tag}`);
        assert.equal(args[1], style);
        assert.equal(args[2], textBefore);
        assert.equal(args[3], p1);
        assert.equal(args[4], textMiddle);
        assert.equal(args[5], p2);
        assert.equal(args[6], textAfter);
        expect(args).to.have.length(7);
        assert.equal(args.join(''), "%ct1color: redHello Mike. How's it going");
        done()
      }
    });
    let logger: Logger = loggerFactory.getLogger(tag, style);
    logger.warn(text, p1, p2)();
  });
  it(`Should warn if params are missing`, function (done) {
    let called = false;
    let loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.LOG_WITH_WARNINGS, <any>{
      log: function(...args: any[]){
        assert.equal(args.join('.'), "%ct2.style.<<<.1.===.>>>");
        assert.isTrue(called, "Error should be called");
        done()
      },
      error: function(...args: any[]){
        called = true;
      },
    });
    let logger: Logger = loggerFactory.getLogger('t2', 'style');
    logger.log('<<<{}==={}>>>', 1)();
  });
  it('should raise error if params more', function (done) {
    let loggerFactory: LoggerFactory = new LoggerFactory(LogStrict.LOG_RAISE_ERROR);
    let logger: Logger = loggerFactory.getLogger('t2', 'style');
    expect(function() {
      logger.log('<<<{}', 1, 2)
    }).to.throw("MissMatch amount of arguments");
    done();
  });
});
