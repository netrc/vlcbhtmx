
// TODO: add code to make sure just one copy

const dburlServer = (url) => (s) => url+s 

const setup = async (server) => {
  const db = { }
  const dburl = dburlServer(server)
  db.check = await fetch(dburl('check')).then( r => r.json() );
  db.churches = await fetch(dburl('churches')).then( r => r.json() );
  db.brasses = await fetch(dburl('brasses')).then( r => r.json() );
  db.rubbings = await fetch(dburl('rubbings')).then( r => r.json() );
  db.pictures = await fetch(dburl('pictures')).then( r => r.json() );
  db.notes = await fetch(dburl('notes')).then( r => r.json() );
  console.log('check: '+db.check)
  return db
}

module.exports = {
  setup,
}
