const glob = require('glob');
const marked = require('marked');
const pug = require('/rc/sw/node_modules/pug/node_modules/pug')

const justPugName = f => f.slice(5,-4)  // convert from pugs/something.pug to something

const getPugs = () => {
  pugFiles = glob.sync('pugs/*.pug')
  pugsCompiled = pugFiles.reduce( (a,c) => { a[justPugName(c)] = pug.compileFile(c); return a }, {} )
  return pugsCompiled
}

// utils
const Okeys = o => Object.keys(o)
const keysToNames = table => Okeys(table).map( k => table[k].name )

// reminder - :cname is a parameter  - req.params.cname,   ?name=value  are query params   req.query
const add_routes = (app, vdb, logger) => {
  var pugs = getPugs() // may be reset during /repugs
  logger.info(`got pugs: ${Object.keys(pugsCompiled)}`)

  app.get('/', (req, res) => {
    res.send(pugs.index())
  });
  app.get('/status', (req, res) => {
    res.json({ check: vdb.check })
  });
  app.get('/repug', (req, res) => {
    pugs = getPugs()
    res.sendStatus(200)
  });

  app.get('/churches', (req, res) => {
    const cList = keysToNames(vdb.churches).map( cname => { return {cname: cname, cURL:`/churchInfo/${cname}`} } )    
    const pVals = { listTitle: 'Churches', cList: cList }
    const c_html = pugs.left_list( pVals )
    res.send(c_html)
  });
  app.get('/brasses', (req, res) => {
    const cList = keysToNames(vdb.brasses).map( cname => { return {cname: cname, cURL:`/brassInfo/${cname}`} } ) 
    const pVals = { listTitle: 'Brasses', cList: cList }
    const c_html = pugs.left_list( pVals )
    res.send(c_html)
  });
  app.get('/rubbings', (req, res) => {
    const cList = keysToNames(vdb.rubbings).map( cname => { return {cname: cname, cURL:`/rubbingInfo/${cname}`} } )
    const pVals = { listTitle: 'Rubbings', cList: cList }
    const c_html = pugs.left_list( pVals )
    res.send(c_html)
  });
  app.get('/churchInfo/:cname', (req, res) => {
    const c = vdb.churchesByName[req.params.cname]
    // set some vals;  use current/cached version if available;  else get from vdb
    //c.BrassesVals = c.BrassesVals || c.Brasses?.map( b => vdb.brasses[b] ) || []
    //c.picturesVals = c.picturesVals || c.pictures?.map( p => vdb.pictures[p] )|| []
    //c.fullPic = c.fullPic || c.picturesVals[0]?.full ? c.picturesVals[0].full : '/nopic.jpg'
    c.BrassesVals = c.Brasses?.map( b => vdb.brasses[b] ) || []
    c.picturesVals = c.pictures?.map( p => vdb.pictures[p] )|| []
    c.fullPic = c.picturesVals[0]?.full ? c.picturesVals[0].full : '/nopic.jpg'
    c.mainNoteHTML = c.mainNote ? marked.parse(c.mainNote) : '<i> no notes </i>'
    const pVals = { c: c }
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

  app.get('/brassInfo/:bname', (req, res) => {
    const c = vdb.BrassesByName[req.params.bname]
    // set some vals;  use current/cached version if available;  else get from vdb
    c.RubbingsVals = c.rubbings?.map( r => vdb.rubbings[r] ) || []
    c.picturesVals = c.pictures?.map( p => vdb.pictures[p] )|| []
    c.fullPic = c.fullPic || c.picturesVals[0]?.full ? c.picturesVals[0].full : '/nopic.jpg'
    c.mainNoteHTML = c.mainNote ? marked.parse(c.mainNote) : '<i> no notes </i>'
    const pVals = { c: c }
    var c_html 
    try {
      c_html = pugs.brass_info( pVals )
    } catch (err) {
        console.error('error with rubbing_info pug')
        console.error(err)
        res.status(505)
        res.send()
    }
    res.send(c_html)   
  })

  app.get('/rubbingInfo/:rname', (req, res) => {
    const c = vdb.RubbingsByName[req.params.rname]
    // set some vals;  use current/cached version if available;  else get from vdb
    //c.picturesVals = /*c.picturesVals ||*/ c.pictures?.map( p => vdb.pictures[p] )|| []
    //c.fullPic = /*c.fullPic ||*/ c.picturesVals[0]?.full ? c.picturesVals[0].full : '/nopic.jpg'
    c.fullPic = '/nopic.jpg'
    c.mainNoteHTML = c.mainNote ? marked.parse(c.mainNote) : '<i> no notes </i>'
    const pVals = { c: c }
    var c_html 
    try {
      c_html = pugs.rubbing_info( pVals )
    } catch (err) {
        console.error('error with rubbing_info pug')
        console.error(err)
        res.status(505)
        res.send()
    }
    res.send(c_html)   
  })

}

module.exports = {
  add_routes
}
