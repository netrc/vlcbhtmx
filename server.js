
const express = require('/rc/sw/node_modules/express/node_modules/express')
const { logger } = require('./log.js')  // creates logger
const findDBservice = require('./findDBservice.js')  // RW or RO?
const morgan = require('morgan');
const path = require('path');
const glob = require('glob');
const marked = require('marked');
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

console.log(findDBservice)
  const my_server = await findDBservice.checkServers()
  console.log(`my server: ${my_server}`)
  const vdb = await db.setup(my_server)

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
    res.send()
  });

  // statistics page - add check output too

  app.get('/churches', (req, res) => {
console.log('/churches');console.dir(req.params)
console.log('/churches query');console.dir(req.query)
    const cList = Object.keys(vdb.churches).map( k => vdb.churches[k].name ).map( cname => { return {cname: cname, cURL:`/churchInfo/${cname}`} } )
console.dir(cList)
    const pVals = { listTitle: 'Churches', cList: cList }
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
  app.get('/churchInfo/:cname', (req, res) => {
console.log('get ci params cname',req.params.cname);
console.log('get /churchInfo');console.dir(req.params)
console.log('get /churchInfo query');console.dir(req.query)
    const kA = Object.keys(vdb.churches).filter( k => vdb.churches[k].name==req.params.cname )
    const k = kA[0]
console.log('k');console.dir(k)
    const c = vdb.churches[k]
console.log('c');console.dir(c)
    c.BrassesVals = c.BrassesVals || c.Brasses?.map( b => vdb.brasses[b] ) || []
    c.picturesVals = c.picturesVals || c.pictures?.map( p => vdb.pictures[p] )|| []
    c.mainNoteHTML = marked.parse(c.mainNote) || '<i> no notes </i>'
    const pVals = { c: c }
console.log('pvals');console.dir(pVals)
    var c_html 
    try {
      c_html = pugs.church_info( pVals )
    } catch (err) {
        console.error('error with church_info pug')
        console.error(err)
        res.status(505)
        res.send()
    }
    res.send(c_html)
  })


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
