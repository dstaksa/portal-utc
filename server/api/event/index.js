import express from 'express';
import * as controller from './event.controller';
import { parseReq, hasRoles, cleanSysCol, hasScreen } from '../../auth/auth.service';
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
          hasScreen('Event'),
          controller.index
        )
        .get('/:id', 
          parseReq(), 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Event'),
          controller.show
        )
        .post('/', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Event'),
          multer({dest:`${baseUri}${sub.event}`}).single('file'),
          cleanSysCol(),
          controller.create)
        .put('/:id', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Event'),
          multer({dest:`${baseUri}${sub.event}`}).single('file'),
          cleanSysCol(),
          controller.update
        )
        .delete('/:id', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Event'),
          controller.del
        )

        .get('/public/index/:month/:year', parseReq(), controller.indexPublic)
        .get('/public/show/:id', parseReq(), controller.show)
  return _router;
}

export default {
  router
};