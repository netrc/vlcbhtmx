const findDBservice = require('./findDBservice.js')  // RW or RO?

// TODO: add code to make sure just one copy


const dburlServer = (url) => (s) => url+s 


// reducer helper - set accumulator object field (churches.name) to the object
const keysToField = (obj,field) => (a,c) => { a[obj[c][field]] = obj[c]; return a}
// convert an object with rec# keys to object with 'field' (name) keys
const keysObjToField = (field) => (obj) => Object.keys(obj).reduce( keysToField(obj,field), {} )
const keysObjToName = keysObjToField('name')

//const keysObjToName = obj => Object.keys(obj).reduce( (a,c) => { a[obj[c]['name']] = obj[c]; return a}, {} )

const setup = async (server) => {
  const my_server = await findDBservice.checkServers()

  const db = { }
  const dburl = dburlServer(my_server.url)
  db.check = await fetch(dburl('check')).then( r => r.json() );
  db.churches = await fetch(dburl('churches')).then( r => r.json() );
  db.brasses = await fetch(dburl('brasses')).then( r => r.json() );
  db.rubbings = await fetch(dburl('rubbings')).then( r => r.json() );
  db.pictures = await fetch(dburl('pictures')).then( r => r.json() );
  db.notes = await fetch(dburl('notes')).then( r => r.json() );

  // do some indexing, filtering
  //db.churchesByName = Object.keys(db.churches).reduce( (a,c) => { a[db.churches[c].name] = db.churches[c]; return a},  {})
  db.churchesByName = keysObjToName(db.churches)
  db.brassesByName = Object.keys(db.brasses).reduce( (a,c) => { a[c.name] = c; return a},  {})
  db.rubbingssByName = Object.keys(db.rubbings).reduce( (a,c) => { a[c.name] = c; return a},  {})
  db.my_server = my_server
  console.log(`check: ${JSON.stringify(db.check)}`)
  return db
}

module.exports = {
  setup,
}
