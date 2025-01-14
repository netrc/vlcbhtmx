

// add code to make sure just one copy


vURL='http://v2.netrc.com:8000/vlcb2api/'
const dburl = s => vURL+s 



const setup = async () => {
  const db = { }
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
