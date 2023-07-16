import express from 'express';
import local from './local';
import ad from './ad';
import passport from 'passport';
import env from '../../config/environment';
import { setupPassport } from './local/passport';
import * as auth from './auth.service';

export default (app) => {
  let { db } = app;
  setupPassport(db);
  const router = express.Router();

  auth.initDbConnection(db);
  router.use('/local', local(db));
  router.use('/ad', ad(db));
  router.get('/logout', (req, res) => {
    return res.status(200).send('ok');
  });

  app.use('/auth', router);
  app.use(passport.initialize());
  app.use(passport.session(env.session.options))
};