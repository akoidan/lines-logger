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


**Pay attention** that `logger.log` returns a function that should be called, thus `console.log` is called from YOUR location instead of the library.