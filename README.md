# <img width="350px" src="/lines-logger.png"/> 
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/deathangel908/lines-logger/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/lines-logger.svg)](https://www.npmjs.com/package/lines-logger) [![Build Status](https://travis-ci.org/akoidan/lines-logger.svg?branch=master)](https://travis-ci.org/akoidan/lines-logger) [![codecov](https://codecov.io/gh/akoidan/lines-logger/branch/master/graph/badge.svg)](https://codecov.io/gh/akoidan/lines-logger) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/akoidan/lines-logger/issues) [![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

[![NPM](https://nodei.co/npm/lines-logger.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/lines-logger/)

A simple browser logger that features:

- Colored tags
- Show origin source files
- Supports log levels that can be changed in runtime.

Make your logs look like this:

![logs example](https://raw.githubusercontent.com/Deathangel908/lines-logger/master/demo.jpeg)

# Installation:

### With npm:
 
 Install the logger `npm install lines-logger --save`.
 
### By including a link:
```html
<script src="https://cdn.jsdelivr.net/npm/lines-logger@2.1.2/lib/browser.js"></script>
<script>
var LoggerFactory  = linesLogger.LoggerFactory;
var loggerFactory = new LoggerFactory();
var logger = loggerFactory.getLogger('tag');
</script>
```

# Configuration

## Create logger

### If you use javascript:
```javascript
var LoggerFactory = require('lines-logger').LoggerFactory; // import {LoggerFactory} from 'lines-logger';
var loggerFactory = new LoggerFactory();
var logger = loggerFactory.getLogger('tag');
```

### If you use Typescript:
```typescript
import {Logger, LoggerFactory} from 'lines-logger';

let factory: LoggerFactory = new LoggerFactory();
let logger: Logger = factory.getLogger('tag');
```

##  Log anywhere in your code:
```javascript
logger.log('Hello world')(); // pay attention to () in the end. `logger.log` returns a function that should be called, thus `console.log` is called from YOUR location instead of the library.
logger.debug('My array is {}, object is {}', [1,2,3], {1:1, 2:2})();
```

# Documentation

## LoggerFactory API

|method|description|
|-|-|
| `getLogger`| Returns a logger object that has binded functions warn/error/log/debug/trace| `var logger = loggerFactory.getLogger('tag')`. Logger will have random tag color, depending on hash of the name.|
| `setLogWarnings(LEVEL)` | Sets logger level see [LogLevel](#loglevel)
| `getSingleLoggerStyle` | Returns single logger function with specified style | `var log = loggerFactory.getSingleLoggerStyle('tag', 'color: #006c00;', console.log); log('hello world')()`|
| `getSingleLogger` | Returns single logger function with random color (color persist if tag is the same) | `var log = loggerFactory.getSingleLoggerStyle('tag', console.log); log('hello world')()`|
| `getSingleLoggerColor` | Same as getSingleLogger but with predefined tag color | `loggerFactory.getSingleLoggerColor('tag', 'blue')`|
| `getLoggerColor`| Same as getLogger, but with predefined tag style| `loggerFactory.getLogger('tag', 'black')`|

## LogLevel

|name|importance|description| 
|-|-|-|
|log_raise_error | 1 |  Log everything and if params specified in string construct mismatch actual arguments, e.g. `logger.log('two params given {} {}', one_suplied)();` throw an error. | 
|log_with_warnings | 2 | Log everything and if params specified in string construct mismatch actual arguments, e.g. `logger.log('one param given {}', one_suplied, two_supplied)();` warn in console about it. | 
|trace | 3 | Log everything. |
|debug | 4 | Log `debug`, `info`, `warn`, `error` only. `trace` won't be printed. |
|info | 5 | Log `info`, `warn`, `error` only. `debug` and `trace` won't be printed. |
|warn | 6 | Log `warn`, `error` only. `info`, `debug` and `trace` won't be printed. |
|error | 7 | Log `error` only. `warn` `info`, `debug` and `trace` won't be printed. |
|disable | 8 | Disable all logs completely |

## Logger API
|method|description|
|-|-|
| `logger.trace('Hello world')()`| Executes `console.trace('YOUR TEXT')` if log level is less\equal `trace`, level `3` |
| `logger.debug('Hello world')()` | Executes `console.debug('YOUR TEXT')`  if log level is less\equal `debug` level `4` |
| `logger.log('Hello world')()` | Executes `console.log('YOUR TEXT')`  if log level is less\equal `info` level `5` |
| `logger.warn('Hello world')()` | Executes `console.warn('YOUR TEXT')`  if log level is less\equal `warn` level `6` 
| `logger.error('Hello world')()` | Executes `console.log('YOUR TEXT')`  if log level is less\equal `error` level `7`|
| `logger.log('Hello {}!', 'world')()`| Logger allow to print params to the middle of the line, by using `{}` |

# Best practices:
- Check [vue-webpack-typescript](https://github.com/akoidan/vue-webpack-typescript) repository for an example of project structure with lines logger.
- Use positional arguments like `logger.log('Hello {}', { text: 'world'} )` when you want a browser to paste an object instead of string. Remember chrome and some other browsers don't freeze this object, meaning it's live. So when you later change its value it automatically changes in the log (if it's not rendered yet). So if you need to paste just a simple text use es6 templates: `logger.log(``Hello world``)` .
- If you need time for your logs, modern browser provide that out of the box. E.g. in chrome you can go to preferences -> console -> Show timestamps.
- You can turn off logs for production builds, while creating logger factory `new LoggerFactory('disable');` or using method `setLogWarnings('disable')`. E.g. for webpack you can use [DefinePlugin](https://stackoverflow.com/a/29851256/3872976), the example is [here](https://github.com/akoidan/vue-webpack-typescript/blob/7ff6596c502bf7185378471088c3545d903c8e38/src/utils/singletons.ts#L7)
- You would probably like to expose loggerFactory to global scope (window). Thus in case of troubleshooting you can go to production site and turn on logs during runtime.
``` js
var LoggerFactory = require('lines-logger').LoggerFactory;
var loggerFactory = new LoggerFactory();
window.loggerFactory = loggerFactory
```
Now if you need to debug your production site you can just open devtools and type `loggerFactory.setLogWarnings('trace')`
- If you want to intercept/mock logs for testing or any other purpose, you can pass object callbacks as a 2nd param to a loggerFactory constructor
``` js
import { spy } from 'sinon'
var loggerSpy = spy()
new LoggerFactory('trace', {
  error: function () {
    loggerSpy(arguments)
  },
  warn: function () {
    loggerSpy(arguments)
  },
  trace: function () {
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
- Timestamps . I inspire to use integrated timestamps feature in the browser instead of custom parameter in the logger. See [this feature](https://github.com/akoidan/lines-logger/issues/5#issuecomment-815566299)
- Ensuring you don't forget to execute logger twice. You can use this eslint rule. And make a rule to name your logger object as `logger`.
**.eslintrc.json**
```json
{
  "rules": {
    "selector": "CallExpression[callee.object.name='logger']:not([parent.type='CallExpression'])",
    "message": "You must call logger.[log,warning,debug,trace,error](\"message\")() as a function 2 times"
  }
}
```

# Contributions

This package uses only ts with target es5. I also added babel config, but it seems like it's redundant, so it's not used.

 - `yarn install` - installs devDependencies. I use `yarn.lock` but npm work as well.
 - `yarn build` - compiles code to `./lib` directory. This build has:
   -  Type definitions in `index.d.ts`
   -  Umd version for import via script tag `browser.js`
   -  CommonJS version for if you use bundler like webpack `index.js`.
 - `yarn test` - runs mocha tests from `./test/index.ts.
 - `yarn lint:check` - lints the src directory. Ignore the `test` dir. 
 - `yarn lint:fix` - automatically fixes wrong formatting in `src`.
 - `yarn publish` - updates npm version
