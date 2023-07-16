import express from 'express';
import passport from 'passport';
import * as auth from '../auth.service';
import { wrapAsync, apiError } from '../../services';
import env from '../../../config/environment';

export default db => {
  const router = express.Router();

  router
    .post('/', async (req, res, next) => {
      passport.authenticate('local', {session: true}, (err, user, info) => {
        let error = err || info;
        if (error) return res.status(401).json(error);
        if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});

        let token = auth.signToken(user.id);
        res.cookie('access-token', token, env.session.cookieOptions);
        res.json({token});
      })(req, res, next);
    })

    .get('/me', auth.checkingAuth(true), wrapAsync(async (req) => {
      return req.user.user;
    }))

  
  return router;
}