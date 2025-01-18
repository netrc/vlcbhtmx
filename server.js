console.log('starting...')
const express = require('/rc/sw/node_modules/express/node_modules/express')
const { logger } = require('./log.js')  // creates logger
const morgan = require('morgan');
const db = require('./db.js')  // creates logger
const appRoutes = require('./appRoutes.js')

const setup_app = async () => {

  const vdb = await db.setup()
  logger.info(`my server: ${vdb.my_server.url}  isRW: ${vdb.my_server.isRW}`)

  const app = express();
  const port = process.env.PORT || 8000;

  // log and json parse all requests
  app.use(morgan('combined', { // HTTP request logging
    stream: {
      write: (message) => logger.http(message.trim())
    }
  }));
  app.use(express.json()); // parse JSON bodies
  app.use((req, res, next) => { // log all requests
    logger.info(`Incoming ${req.method} request to ${req.url}`, {
      method: req.method,
      url: req.url,
      ip: req.ip
    });
    next();
  });

  appRoutes.add_routes(app, vdb, logger)

  // defaults and error handling
  app.use(express.static('static'))
  app.use((req, res) => { // default 404 handler
    logger.warn(`Route not found: ${req.url}`);
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((err, req, res, next) => { // Error handling middleware
    logger.error('Unhandled error:', {
      error: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: 'Internal server error' });
  });

  app.listen(port, () => {
    logger.info(`server started on port ${port}`);
  });

  return app
}

setup_app()

process.on('uncaughtException', (error) => { // uncaught exceptions
  console.error(error)
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => { // unhandled rejections
  logger.error('Unhandled Promise Rejection:', {
    reason: reason,
    stack: reason.stack
  });
  process.exit(1);
});
