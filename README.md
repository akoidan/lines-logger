# lines-logger  [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/deathangel908/lines-logger/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/lines-logger.svg)](https://www.npmjs.com/package/lines-logger) [![Build Status](https://travis-ci.org/akoidan/lines-logger.svg?branch=master)](https://travis-ci.org/akoidan/lines-logger) [![HitCount](http://hits.dwyl.io/akoidan/lines-logger.svg)](http://hits.dwyl.io/akoidan/lines-logger) [![codecov](https://codecov.io/gh/akoidan/lines-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/akoidan/lines-logger) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/akoidan/lines-logger/issues) [![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

[![NPM](https://nodei.co/npm/lines-logger.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/lines-logger/)

A simple browser logger that features:

- Colored tags
- Show origin source files
- Can be disabled for production or any other reason, even in runtime.
- Typescript support
- Renders objects as they are, instead of stringifying them

Make your logs look like this:

![logs example](https://raw.githubusercontent.com/Deathangel908/lines-logger/master/demo.jpeg)

# 1. Installation:

### With npm:
 
 Install the logger `npm install lines-logger --save`.
 
### By including a link:
```html
<script src="https://cdn.jsdelivr.net/npm/lines-logger@{{VERSION}}/lib/browser.js"></script>
```
where `{{VERSION}}` is [![npm version](https://img.shields.io/npm/v/lines-logger.svg)](https://www.npmjs.com/package/lines-logger). e.g. [https://cdn.jsdelivr.net/npm/lines-logger@1.2.0/lib/browser.js](https://cdn.jsdelivr.net/npm/lines-logger@1.2.0/lib/browser.js)

# 2. Configuration

## 2.1 Create logger

### If you use javascript:
```javascript
var LoggerFactory = require('lines-logger').LoggerFactory; // import {LoggerFactory} from 'lines-logger';
var loggerFactory = new LoggerFactory();
var logger = loggerFactory.getLoggerColor('tag', 'blue');
```

### If you use Typescript:
```typescript
import {Logger, LoggerFactory} from 'lines-logger';

let factory: LoggerFactory = new LoggerFactory();
let logger: Logger = factory.getLoggerColor('tag', 'blue');
```

## 2.2 Log anywhere in your code:
```javascript
logger.log('Hello world')(); // pay attention to () in the end. `logger.log` returns a function that should be called, thus `console.log` is called from YOUR location instead of the library.
logger.debug('My array is {}, object is {}', [1,2,3], {1:1, 2:2})();
```

# 3. Documentation

|method|description|example|
|-|-|-|
| `LoggerFactory.getLogger`| Returns a logger object that has binded functions warn/error/log/debug/trace| `var logger = loggerFactory.getLogger('tag', 'background-color: black')`|
| `LoggerFactory.setLogWarnings(LOG_RAISE_ERROR)` | log everything and if params specified in string construct mismatch actual arguments, e.g. `logger.log('two params given {} {}', one_suplied)();` throw an error| `loggerFactory.setLogWarnings(1)`|
| `LoggerFactory.setLogWarnings(LOG_WITH_WARNINGS)` | log everything and if params specified in string construct mismatch actual arguments, e.g. `logger.log('one param given {}', one_suplied, two_supplied)();` warn in console about it | `loggerFactory.setLogWarnings(2)`|
| `LoggerFactory.setLogWarnings(TRACE)` | log everything but don't warn about param missmatch | `loggerFactory.setLogWarnings(3)`|
| `LoggerFactory.setLogWarnings(DEBUG)` | log everything above `DEBUG`, this doesn't log `TRACE` to console| `loggerFactory.setLogWarnings(4)`|
| `LoggerFactory.setLogWarnings(INFO)` | log everything above `INFO`, this doesn't log `TRACE` nor `DEBUG` to console| `loggerFactory.setLogWarnings(5)`|
| `LoggerFactory.setLogWarnings(WARN)` | log everything above `WARN`, this doesn't log `TRACE` nor `DEBUG`  nor `INFO` to console| `loggerFactory.setLogWarnings(6)`|
| `LoggerFactory.setLogWarnings(ERROR)` | log everything above `WARN`, this doesn't log `TRACE` nor `DEBUG`  nor `INFO` to console| `loggerFactory.setLogWarnings(7)`|
| `LoggerFactory.setLogWarnings(DISABLE_LOGS)` | Don't log anything at all, meaning fully disable logs| `loggerFactory.setLogWarnings(8)`|
| `LoggerFactory.getSingleLogger` | Returns single logger function  | `var log = loggerFactory.getSingleLogger('tag', 'color: #006c00;', console.log); log('hello world')()`|
| `LoggerFactory.getSingleLoggerColor` | Same as getSingleLogger but with predefined tag style| `loggerFactory.getSingleLoggerColor('tag', 'blue')`|
| `LoggerFactory.getLoggerColor`| Same as getLogger, but with predefined tag style| `loggerFactory.getLogger('tag', 'black')`|
| `Logger.trace`| executes `console.debug('YOUR TEXT')` if log level is less\equal `TRACE` or `3` | `logger.log('Hello world')()`|
| `Logger.debug`| executes `console.debug('YOUR TEXT')`  if log level is less\equal `DEBUG` or `4` | `logger.debug('Hello world')()`|
| `Logger.log` | executes `console.log('YOUR TEXT')`  if log level is less\equal `INFO` or `5` | `logger.log('Hello world')()`|
| `Logger.warn` | executes `console.warn('YOUR TEXT')`  if log level is less\equal `WARN` or `6` | `logger.warn('Hello world')()`|
| `Logger.error` | executes `console.log('YOUR TEXT')`  if log level is less\equal `ERROR` or `7`| `logger.error('Hello world')()`
| `Logger.log('{}', p1)`| logger allow to print params to the middle of the line | `logger.log('Hello {}!', 'world')()`|


# 4. Best practice:
- You can turn off logs for production builds, while creating logger factory `new LoggerFactory(8);` or using method `setLogWarnings(8)`. E.g. for webpack you can use [DefinePlugin](https://stackoverflow.com/a/29851256/3872976), the example is [here](https://github.com/akoidan/vue-webpack-typescript/blob/7ff6596c502bf7185378471088c3545d903c8e38/src/utils/singletons.ts#L7)
- You would probably like to expose loggerFactory to global scope (window). Thus in case of troubleshooting you can go to production site and turn on logs during runtime.
``` js
var LoggerFactory = require('lines-logger').LoggerFactory;
var loggerFactory = new LoggerFactory();
window.loggerFactory = loggerFactory
```
Now if you need to debug your production site you can just open devtools and type `loggerFactory.setLogWarnings(2)`
- If you want to intercept/mock logs for testing or any other purpose, you can pass object callbacks as a 2nd param to a loggerFactory constructor
``` js
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

# 5. Building yourself:
 - `yarn install` - installs devDependencies. I use `yarn.lock` but npm work as well.
 - `yarn build` - compiles code to `./lib` directory. This build has:
   -  Type definitions in `index.d.ts`
   -  Umd version for import via script tag `browser.js`
   -  CommonJS version for if you use bundler like webpack `index.js`.
 - `yarn test` - runs mocha tests from `./test/index.ts.
 - `yarn lint:check` - lints the src directory. Ignore the `test` dir. 
 - `yarn lint:fix` - automatically fixes wrong formatting in `src`.
 - `yarn publish` - updates npm version
