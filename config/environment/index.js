import _ from 'lodash';

const conf = {
  port: process.env.PORT || 3001,

	//MAIL
  mail: {
		//mail sender
		sender: {
			host: '',
			port: 25,
			secure: false, // use SSL
			auth: {
				user: 'admin.utc@pertamina.com',
				pass: 'Pertamina123',
username: 'admin.utc', password: 'Pertamina123'
			},
			tls: {rejectUnauthorized: false}
		},

		//mail receiver
		receiver: '',

		//opt
		useMailServer: false
	},

	//GOOGLE
	google:{
		recaptcha:{
			siteKey:'6LdNZ-cUAAAAAJIE1S8V-mFixbklzn79y8Tcctm7',
			secretKey: '6LdNZ-cUAAAAAJIE1S8V-mFixbklzn79y8Tcctm7',
			active: false
		}
	},

	initDb:{
		createTable: false,
		populate: false,
	},

	contact:{
		phone: null,
		address: "<p>"+
			"Jl. TB Simatupang No.Kav, 99,"+
			"<br/>Kebagusan, Kec, Ps. Minggu, Kota"+
			"<br/>Jakarta Selatan"+
			"<br/>PHE Tower Lantai 17"+
			"<p>"
	},

        adAuthentication: false
}

let all = _.merge(
	conf,
	require(`./${process.env.NODE_ENV || 'development'}.js` || {}).default
)

export default all 
