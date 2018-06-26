# lines-logger  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/deathangel908/lines-logger/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/lines-logger.svg)](https://www.npmjs.com/package/lines-logger) [![Build Status](https://travis-ci.org/Deathangel908/lines-logger.svg?branch=master)](https://travis-ci.org/Deathangel908/lines-logger)
A simple browser logger that features:

- Colored tags
- Show origin source files
- Can be disabled for production or any other reason, even in runtime.
- Typescript support
- Renders objects as they are, instead of stringifying them

Make your logs look like this:

![logs example](https://raw.githubusercontent.com/Deathangel908/lines-logger/master/demo.jpeg)

##How to use:

Install the logger `npm install lines-logger`.

 **typescript**:
```
import {Logger, LoggerFactory} from 'lines-logger';

let factory: LoggerFactory = new LoggerFactory();
let logger: Logger = factory.getLoggerColor('tag', 'blue');
logger.log('Hello world')();
logger.debug('Show object structure {}', {key: 1})();
```

**es3**:
```
var LoggerFactory = require('lines-logger').LoggerFactory;
var loggerFactory = new LoggerFactory();
var logger = loggerFactory.getLoggerColor('global', '#753e01');
logger.log('hello')();
```


|method|description|example|
|-|-|-|
| `factory.getLogger`| Return logger object that has binded functions warn/error/log/debug| `var logger = loggerFactory.getLogger('tag', 'background-color: black')`|
| `logger.log` [log/error/warn/debug]| Prints `console.log('YOUR TEXT')` | `logger.log('Hello world')()`|
| `logger.log('{}', p1)`| logger allow to print params to the middle of the line | `logger.log('Hello {}', 'world')()`|
| `factory.setLogWarnings` | sets logs to: 0 = disables logs, 1 = enable logs, 2 = enables logs and warns if params mismatch, 3 = enables logs and throws error if params mismatch | `loggerFactory.setLogWarnings(0)`|
| `factory.getSingleLogger` | Returns single logger function  | `var log = loggerFactory.getSingleLogger('tag', 'color: #006c00;', console.log); log('hello world')()`|
| `factory.getSingleLoggerColor` | Same as getSingleLogger but with predefined tag style| `loggerFactory.getSingleLoggerColor('tag', 'blue')`|
| `factory.getLoggerColor`| Same as getLogger, but with predefined tag style| `loggerFactory.getLogger('tag', 'black')`|


**Pay attention** that `logger.log` returns a function that should be called, thus `console.log` is called from YOUR location instead of the library.

## Some tricks:
- Don't forget to turn logs during production, you can either pass `0` to constructor: `new LoggerFactory(0);`.  Or use `setLogWarnings(0)`.
- If there's a case that you need to check logs while production, you can easily do so by exposing loggerFactory to a global variable. 
```
var LoggerFactory = require('lines-logger').LoggerFactory;
var loggerFactory = new LoggerFactory();
window.loggerFactory = loggerFactory
```
Now if you need to debug your production site you can just open devtools and type `loggerFactory.setLogWarnings(1)`
- If you want to intercept logs with something like [SinonSpy](http://sinonjs.org/releases/v4.0.0/spies/), you can pass it as a 2nd param to a loggerFactory constructor
```
import { spy } from 'sinon'
var loggerSpy = spy()
new LoggerFactory(0, {
  error: function () {
    loggerSpy(arguments)
  },
  warn: function () {
    loggerSpy(arguments)
  },
  debug: function () {
    loggerSpy(arguments)
  },
  log: function () {
    loggerSpy(arguments)
  }
})
```
