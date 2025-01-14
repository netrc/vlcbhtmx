
const winston = require('winston');
//const morgan = require('morgan');
const path = require('path');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-service' },
  transports: [
    // Write all logs with importance level 'error' or less to error.log
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'error.log'),
      level: 'error'
    }),
    // Write all logs with importance level 'info' or less to combined.log
    new winston.transports.File({
      filename: path.join(__dirname, 'logs', 'combined.log')
    }),
    // Console output with colorization
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});


module.exports = {
  logger
}


// examples
//  } catch (error) {
//    logger.error('An error occurred', {
//      error: error.message,
//    stack: error.stack
    //});
    //res.status(500).json({ error: 'Internal server error' });
  //}
//});

//app.get('/test-warning', (req, res) => {
  //logger.warn('This is a warning message', {
    //customField: 'test',
    //timestamp: new Date()
  //});
  //res.json({ message: 'Warning logged' });
//});
