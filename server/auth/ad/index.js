

import express from 'express';
import { find } from 'lodash';
import axios from 'axios';
import * as auth from '../auth.service';
import { wrapAsync, apiError } from '../../services';
import env from '../../../config/environment';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const isProd = process.env.NODE_ENV === 'production';
export default (db) => {
  const router = express.Router();

  router
    .post('/', (req, res, next) => {
      passport.authenticate('local', {session: true}, async (err, user, info) => {
        let { username, password } = req.body;
        password = new Buffer(password).toString('base64');
        password = encodeURIComponent(password);

        try{
          let application = await db(isProd ? 'SECURE.APPLICATION' : 'SECURE_APPLICATION')
            .select('ID')
            .where('APPLICATION_NAME', 'AMSPORTAL')
            .first();

          if(!application) return res.status(404).send('Aplikasi AMS Portal tidak ditemukan');
          
          let conf = await db(isProd ? 'SECURE.CONFIG' : 'SECURE_CONFIG')
            .select('*')
            .whereIn('CODE', ['DOMAIN.SERVER', 'LOGIN.SERVICE'])
          
          if(isProd){
            const domain = find(conf, {CODE: 'DOMAIN.SERVER'});
            const service = find(conf, {CODE: 'LOGIN.SERVICE'});
            const url = `${service.CONTENT}${domain.CONTENT}/${username}/${password}`;

            let resLogin = await axios.get(url);
            if(String(resLogin.data.login) === '0') return res.status(401).send('Username atau password salah');
          }

          let user = await db(isProd ? 'SECURE.USERS' : 'SECURE_USERS')
            .select('ID', 'USERNAME', 'LONGNAME', 'ACTIVE')
            .where({USERNAME: username})
            .first()

          if(!user) return res.status(401).send('User tidak ditemukan');
          
          let roles = await db(isProd ? 'SECURE.USER_ROLE' : 'SECURE_USER_ROLE')
            .select('*')
            .where({USERS: user.ID})
            // .first();

          if(!roles) return res.status(401).send('Role user tidak ditemukan');
          roles = roles.map(d => (d.ROLE))

          let  screen = await db(`${isProd ? 'SECURE.ROLE_SCREEN' : 'SECURE_ROLE_SCREEN'} as role_screen`)
            .leftJoin(`${isProd ? 'SECURE.SCREEN' : 'SECURE_SCREEN'} as screen`, 'screen.ID', 'role_screen.SCREEN')
            .select(
              'role_screen.*',
              'screen.SCREEN_NAME'
            )
            // .where('role_screen.ROLE', role.ROLE)
            .whereIn('role_screen.ROLE', roles)
            .where('screen.APPLICATION', application.ID)

          if(screen.length === 0) return res.status(401).send('Maaf, Anda tidak memiliki ijin');
          
          let { secret, jwtOptions } = env.session;
          let token = jwt.sign({user, roles, screen, username: user.USERNAME}, secret, jwtOptions);
          // console.log(token);
          res.cookie('access-token', token, env.session.cookieOptions);
          res.json(screen);
        }catch(error){
          console.log(error);
          return res.status(500).send(error);
        }
      })(req, res, next);
    })

    .get('/me', auth.checkingAuth(true, true), wrapAsync(async (req) => {
      return req.user
    }))

    return router;
}