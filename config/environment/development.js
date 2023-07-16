export default {
  host:"http://localhost:3001",
  // amsUrl: "http://165.22.243.59/backend/login",
  amsUrl:"http://localhost:3001/account-login",
  dbOptions: {
    client: 'mysql',
    connection:{
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'portal_utc_db',
      debug: false
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
			httpOnly: false 
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
        partner: '/partner',
        file: '/file'
      }
    }
  },
  staticPath:{
    article:'/static/article',
    banner:'/static/banner',
    event:'/static/event',
    home: '/static/home',
    partner: '/static/partner',
    file: '/static/file'
  }
}