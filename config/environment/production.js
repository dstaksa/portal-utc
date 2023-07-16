export default {
  host: "http://upstreaminnovation.pertamina.com",
  localhost:"http://upstreaminnovation.pertamina.com",
  amsUrl: "http://upstreaminnovation.pertamina.com:3001",
  dbOptions: {
    client: 'oracledb',
    connection:{
      //host: '172.20.128.13',
      user: 'ams',
      password: 'amsutc',
      //database: 'orcl',
      //port: 1521,
      debug: false,
      connectString: '(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 172.20.128.13)(PORT = 1521)) (CONNECT_DATA = (SID = orcl)))'
    }
  },
  // JWT expire
  session: {
    jwtOptions: {
      expiresIn: '1 days',
    },
    secret: 'sst-rasahia',
    cookieOptions: {
			maxAge: 2*24*60*60*1000, 
			httpOnly: true 
		}
  },
  path:{
    upload:{
      baseUri:'tmp',
      sub:{
        article:'/article',
        banner:'/banner',
        event: '/event',
        home: '/home',
        partner: '/partner'
      }
    }
  },
  staticPath:{
    article:'/static/article',
    banner:'/static/banner',
    event:'/static/event',
    home: '/static/home',
    partner: '/static/partner'
  }
}