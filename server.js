
const express = require('/rc/sw/node_modules/express/node_modules/express')
const { logger } = require('./log.js')  // creates logger
const morgan = require('morgan');
const path = require('path');
const glob = require('glob');
const pug = require('/rc/sw/node_modules/pug/node_modules/pug')

const db = require('./db.js')  // creates logger


const justPugName = f => f.slice(5,-4)  // convert from pugs/something.pug to something

const getPugs = () => {
  pugFiles = glob.sync('pugs/*.pug')
  pugsCompiled = pugFiles.reduce( (a,c) => { a[justPugName(c)] = pug.compileFile(c); return a }, {} )
  logger.info(`got pugs: ${Object.keys(pugsCompiled)}`)
console.log(pugsCompiled)
  return pugsCompiled
}

const setup_app = async () => {
  // compile all the pugs
  // glob the pug dir?
  //church_list = pug.compileFile('church_list.pug')

  var pugs = getPugs() // may be reset during /repugs

  const vdb = await db.setup()

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


  // Application Route Handlers
  app.get('/', (req, res) => {
    //res.json({ message: 'Welcome to the server!' });
    const opts = { root: path.join(__dirname) }
    res.sendFile('index.html', opts);
  });

  app.get('/status', (req, res) => {
    const jd = { check: vdb.check }
    res.json(jd)
  });
  app.get('/repug', (req, res) => {
    pugs = getPugs()
    res.status(200)
  });

  // statistics page - add check output too

  app.get('/churches', (req, res) => {
    const pVals = { listTitle: 'Churches', cNames: Object.keys(vdb.churches).map( c => vdb.churches[c].name ) }
    const c_html = pugs.left_list( pVals )
    res.send(c_html)
  });
  app.get('/brasses', (req, res) => {
    const pVals = { listTitle: 'Brasses', cNames: Object.keys(vdb.brasses).map( c => vdb.brasses[c].name ) }
    const c_html = pugs.left_list( pVals )
    res.send(c_html)
  });
  app.get('/rubbings', (req, res) => {
    const pVals = { listTitle: 'Rubbings', cNames: Object.keys(vdb.rubbings).map( c => vdb.rubbings[c].name ) }
    const c_html = pugs.left_list( pVals )
    res.send(c_html)
  });


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
