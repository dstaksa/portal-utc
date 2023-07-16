import env from '../../config/environment';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import compose from 'composable-middleware';
import crypto from 'crypto';
import { tableNames } from '../../config/constant';
import kn from 'knexnest'
import { find } from 'lodash';

const validateJwt = expressJwt({secret: env.session.secret});
let db;

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const signToken = (id) => {
  let { secret, jwtOptions } = env.session;
  return jwt.sign({id: id}, secret, jwtOptions)
}

export const makeSalt = () => {
  return crypto.randomBytes(16).toString('base64');
}

export const encryptPassword = (password, salt) => {
    const _salt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, _salt, 10000, 64, 'sha1').toString('base64');
}

export const authenticate = (password, salt, hashedPassword ) => {
  return encryptPassword(password, salt ) === hashedPassword;
}

export const parseReq = () => {
  return compose()
    .use((req, res, next) => {
      req.lang = req.query.lang || req.cookies['lang'] || 'id';
      req.isPublic = req.route.path.startsWith('/public');
      next();
    })
}

export const checkingAuth = (isAuthenticated=false) => {
  return compose()
    .use(parseReq())
    .use((req, res, next) => {
      if(req.user){
        next();
      }else{
        let accessToken = req.cookies['access-token'];
        
        if(accessToken){ //&& req.query.hasOwnProperty('access-token')) {
          req.headers.authorization = 'Bearer ' + accessToken;
        }

        validateJwt(req, res, err => {  
          if(isAuthenticated){
            if(err) return res.status(401).send('Unauthorized');
            next();
          }else{
            next();
          }
        })
      }
    })
    .use(async (req, res, next) => {
      if(req.user){
        if(env.adAuthentication){
          next();
        }else{
          let users = await kn(db(`${tableNames.USER} as user`)
            .where({'user.id': req.user.id})
            .innerJoin(`${tableNames.ROLE} as role`, 'role.id', 'user.roleId')
            .select(
              'user.id as _id',
              'user.username as _username',
              'user.contact as _contact',
              'user.email as _email',
              'user.address as _address',
              'user.dateCreated as _dateCreated',
              'user.createdBy as _createdBy',
              'user.name as _name',
              'role.name as _role_name'
            )
          )

          if(users.length === 0 ) return res.status(404).json({errorMessage:'User is not found'});
          if(users[0].isActive === 0) return res.status(403).json({errorMessage:'User is not active. Call Administrator'});
          req.user = users[0];

          next();
        }
      }else next();
    }
  )
}

export const hasRoles = (roles) => {
  return compose()
    .use(checkingAuth(true))
    .use((req, res, next) => {
      if(env.adAuthentication){
        next();
      }else{
        let hasPermission = roles.indexOf(req.user.role.name) >= 0 ? true : false;
        if(hasPermission){
          next();
        }else{
          return res.status(403).send('Forbidden')
        }
      }
    })
}

export const hasScreen = (screenName) => {
  return compose()
    .use(checkingAuth(true))
    .use((req, res, next) => {
      if(env.adAuthentication){
        let hasPermission = find(req.user.screen, {SCREEN_NAME: screenName});
        if(hasPermission){
          next();
        }else{
          return res.status(401).send(`Unauthorized. Anda tidak memilik akses ke ${screenName}`)
        }
      }else{
        next();
      }
    })
}

export const cleanSysCol = () => {
  return compose()
    .use((req, res, next) => {
      let methods = {
        PUT:{user: 'modifiedBy', date: 'dateModified'},
        POST:{user: 'createdBy', date: 'dateCreated'},
      }
      if(Object.keys(methods).indexOf(req.method) >= 0 && req.body) {
        delete req.body.createdBy;
        delete req.body.modifiedBy;
        delete req.body.publishedBy;
        delete req.body.dateCreated;
        delete req.body.dateModified;
        // delete req.body.datePublished;
        req.body[methods[req.method].user] = req.user.username;
        req.body[methods[req.method].date] = new Date();
      }
      next();
    })
}