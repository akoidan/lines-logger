<p align="center">
<a href="https://www.npmjs.com/package/lines-logger"><img src="https://img.shields.io/npm/v/lines-logger.svg" alt="Version"></a>
</p>

# lines-logger
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
var logger = loggerFactory.getLogger('global', '#753e01');
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