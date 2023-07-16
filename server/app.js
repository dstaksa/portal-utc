import '@babel/polyfill/noConflict';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import next from 'next';
import env from '../config/environment';
import db from './db';
import routes from './routes';
import auth from './auth';
import api from './api';
import i18n from './i18n';
import i18nextMiddleware from 'i18next-express-middleware';
import Backend from 'i18next-node-fs-backend';
import co from 'co';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const handle = nextApp.getRequestHandler();
// const port = dev ? 9000 : (process.env.PORT || env.port);
const port = process.env.PORT || env.port;

/*
const run = () => {
  if(!dev) nextApp.prepare();
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  if(dev) {
    app.use(function(req, res, next) {
      req.lang = req.cookies['lang'] || 'id'
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Expose-Headers", "*");
      next();
    });
  } else {
    app.use((req, res, _next) => {
      req.isProduction = true;
      req.envHost = env.localhost || env.host;
      req.amsUrl = env.amsUrl;
      req.lang = req.cookies['lang'] || 'id'
      _next();
    })
  }

  app.use('/public', express.static('public'));
  // app.use('/static/article', express.static(`${env.path.upload.baseUri}${env.path.upload.sub[p]}`));
  for(let p of ['article', 'banner', 'home', 'partner', 'event']){
    let path = `/static/${p}`
    app.use(path, express.static(`${env.path.upload.baseUri}${env.path.upload.sub[p]}`));
  }

  db(app, () => {
    // app.use('/api/mail', require('./api/mail'));
    
    auth(app);
    api(app);
    routes(app, nextApp, handle);

    app.get('*', (req, res) => (handle(req, res)));
  })

  app.listen(port);
  console.log(`Listening on ${port}`)
}
*/

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'id',
    load: ['id'],
    ns: ['common'],
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
    }
  }, () => {
    co(function * (){
      yield nextApp.prepare();
      const app = express();

      app.use(i18nextMiddleware.handle(i18n));
      app.use('/locales', express.static(__dirname + '/locales'));
      app.post('/locales/add/:lng/:ns', i18nextMiddleware.missingKeyHandler(i18n));

      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());
      app.use(cookieParser());

      if(dev) {
        app.use(function(req, res, next) {
          /*test*/
          req.isProduction = true;
          req.envHost = env.localhost || env.host;
          req.amsUrl = env.amsUrl;
          /**/
          req.lang = req.cookies['lang'] || 'id'
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "*");
          res.header("Access-Control-Allow-Methods", "*");
          res.header("Access-Control-Expose-Headers", "*");
          next();
        });
      } else {
        app.use((req, res, _next) => {
          req.isProduction = true;
          req.envHost = env.localhost || env.host;
          req.amsUrl = env.amsUrl;
          req.lang = req.cookies['lang'] || 'id'
          _next();
        })
      }

      app.use('/public', express.static('public'));
      // app.use('/static/article', express.static(`${env.path.upload.baseUri}${env.path.upload.sub[p]}`));
      for(let p of ['article', 'banner', 'home', 'partner', 'event']){
        let path = `/static/${p}`
        // console.log(path);
        app.use(path, express.static(`${env.path.upload.baseUri}${env.path.upload.sub[p]}`));
      }

      db(app, () => {
        // app.use('/api/mail', require('./api/mail'));
        
        auth(app);
        api(app);
        routes(app, nextApp, handle);
        app.get('*', (req, res) => (handle(req, res)));
      })

      app.listen(port);
      console.log(`Listening on ${port}`)
    }).catch( error => console.log(error.stack));
  })