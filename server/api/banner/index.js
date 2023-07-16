import express from 'express';
import * as controller from './banner.controller';
import { parseReq, hasRoles, hasScreen, cleanSysCol } from '../../auth/auth.service';
import { roles } from '../../../config/constant';
import multer from 'multer';
import env from '../../../config/environment';

const { baseUri, sub } = env.path.upload;

const router = db => {
  controller.initDbConnection(db);
  let _router = new express.Router
      _router
        .get('/', parseReq(), 
          hasRoles([roles.SUPER_ADMIN]),
          hasScreen('Banner'), 
          controller.index
        )
        .get('/:id', parseReq(), 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Banner'),
          controller.show
        )
        .post('/', 
          hasRoles([roles.SUPER_ADMIN]),
          hasScreen('Banner'), 
          multer({dest:`${baseUri}${sub.banner}`}).single('file'),
          cleanSysCol(),
          controller.create
        )
        .put('/:id', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Banner'),
          multer({dest:`${baseUri}${sub.banner}`}).single('file'),
          cleanSysCol(),
          controller.update
        )
        .delete('/:id', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Banner'),
          controller.del
        )

        .get('/public/index', parseReq(), controller.index);
  return _router;
}

export default {
  router
};