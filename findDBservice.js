

// pick rw servier if available

// remember to lock down v2 firewall !
// TODO: or run rw server in home  network
const rw_server = process.env.VLCBSERVER_RW   // runs in RW mode (via RW API key)
const ro_server = process.env.VLCBSERVER_RO      // runs in RO mode (default) (via RO API key)
const check = server_url => server_url+'check'


// TODO: FORCE_RO env var

const checkServers = async () => {
  var server = rw_server
  try {
    const data = fetch(check(server)).then( resp => resp.json() )
  } catch (err) {
    // failure? then no access to RW, hence RO
    console.error(err)
    server = ro_server
  }
  return server
}


const run_site = async () => {
  const my_server = await checkServers()
  console.log('available server: ', my_server)
}

//run_site() // for testing


module.exports = {
  checkServers,
}


// misc code to wait for bunch of fetches
//    const data1 = fetch(check(server)).then( resp => resp.json() )
//    const data2 = fetch(check(server)).then( resp => resp.json() )
//    const data3 = fetch(check(server)).then( resp => resp.json() )
//    const data4 = fetch(check(server)).then( resp => resp.json() )
//    const d = [ data1, data2, data3, data4 ]
//    const ok = await Promise.all(d).then( (vals) => (vals) )
//    console.log(`ok = ${ok}`)
