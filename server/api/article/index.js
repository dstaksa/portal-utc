import express from 'express';
import * as controller from './article.controller';
import { hasRoles, cleanSysCol, parseReq, hasScreen } from '../../auth/auth.service';
import { roles } from '../../../config/constant';
import multer from 'multer';
import env from '../../../config/environment';

const { baseUri, sub } = env.path.upload;

const router = db => {
  controller.initDbConnection(db);
  let _router = new express.Router
      _router
        .get('/', 
          parseReq(), 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Article'),
          controller.index
        )
        .get('/:id', 
          parseReq(), 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Article'),
          controller.show
        )
        .post('/', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Article'),
          multer({dest:`${baseUri}${sub.article}`}).single('file'),
          cleanSysCol(),
          controller.create)
        .put('/:id', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Article'),
          multer({dest:`${baseUri}${sub.article}`}).single('file'),
          cleanSysCol(),
          controller.update
        )
        .delete('/:id', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Article'),
          controller.del
        )

        .get('/public/index', parseReq(), controller.index)
        .get('/public/show/:id', parseReq(), controller.show)
  return _router;
}

export default {
  router
};