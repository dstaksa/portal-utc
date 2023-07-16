import { Router } from 'express';
import { checkingAuth, hasRoles, hasScreen } from './auth/auth.service';
import { pageNotFound} from './components/errors';
import _ from 'lodash';
import { roles } from '../config/constant';
import env from '../config/environment';

let router = Router();

export default (app, nextApp) => {
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

  router.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.render('error', { error: err })
  })


  for(let r of [
    {
      path:'/',
      roles: [],
    },
    {
      path:'/article',
      alias:'/article/:id/:title',
      roles: []
    },
    {
      path: '/manage-user',
      alias: '/manage/user',
      roles: [roles.SUPER_ADMIN],
      screenName: 'User'
    },
    {
      path: '/manage-article',
      alias: '/manage/article',
      roles: [roles.SUPER_ADMIN],
      screenName: 'Article'
    },
    {
      path: '/manage-home',
      alias: '/manage/home',
      roles: [roles.SUPER_ADMIN],
      screenName: 'Home Headline'
    },
    {
      path: '/manage-banner',
      alias: '/manage/banner',
      roles: [roles.SUPER_ADMIN],
      screenName: 'Banner'
    },
    {
      path: '/manage-partner',
      alias: '/manage/partner',
      roles: [roles.SUPER_ADMIN],
      screenName: 'Partner'
    },
    {
      path: '/manage-event',
      alias: '/manage/event',
      roles: [roles.SUPER_ADMIN],
      screenName: 'Event'
    },
    {
      path: '/manage-catalogue-file',
      alias: '/manage/catalogue-file',
      roles: [roles.SUPER_ADMIN],
      screenName: 'Service Catalogue File'
    },
    {
      path: '/account-login',
      alias: '/account/login',
      roles: []
    }
  ]){
    router.get(r.path, r.roles.length > 0 ? hasRoles(r.roles) : checkingAuth(false));
    if(r.alias) router.get(r.alias, (
        env.adAuthentication 
        ? (r.screenName ? hasScreen(r.screenName) : checkingAuth(false)) 
        : (r.roles.length > 0 ? hasRoles(r.roles) : checkingAuth(false))
      ), (req, res) => {
      let query = _.merge(req.params, req.query);
      return nextApp.render(req, res, r.path, query);
    })
  }

  // All undefined asset or api routes should return a 404
  router.use('/:url(api|auth|components|app|bower_components|assets)/*', pageNotFound)
  app.use(router);
} 