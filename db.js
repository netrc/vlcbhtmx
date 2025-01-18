const findDBservice = require('./findDBservice.js')  // RW or RO?

// TODO: add code to make sure just one copy


const dburlServer = (url) => (s) => url+s 

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
  db.churchesByName = Object.keys(db.churches).reduce( (a,c) => { a[c.name] = c; return a},  {})
  db.brassesByName = Object.keys(db.brasses).reduce( (a,c) => { a[c.name] = c; return a},  {})
  db.rubbingssByName = Object.keys(db.rubbings).reduce( (a,c) => { a[c.name] = c; return a},  {})
  db.my_server = my_server
  console.log(`check: ${JSON.stringify(db.check)}`)
  return db
}

module.exports = {
  setup,
}
