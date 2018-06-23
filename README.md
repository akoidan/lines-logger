# lines-logger
A simple browser logger that keeps origin source files location.  Make your logs look like this:

- Colored tags
- Show origin source files
- Can be disabled for production or any other reason, even in runtime.
- Typescript support
- Renders objects as they are, instead of stringifying them
![logs example](https://raw.githubusercontent.com/Deathangel908/lines-logger/master/demo.jpeg)


```
var factory = new LoggerFactory();
var logger = factory.getLoggerColor('tag', 'blue');
logger.log('Hello world')();
logger.debug('Show object structure {}', {key: 1})();
```

**Pay attention** that `logger.log` returns a function that should be called, thus `console.log` is called from YOUR location instead of the library.