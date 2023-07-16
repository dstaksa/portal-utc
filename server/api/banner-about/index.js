import express from 'express';
import * as controller from './banner-about.controller';
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
          hasScreen('Banner About'),
          controller.index
      )
        .get('/:id', 
          parseReq(), 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Banner About'),
          controller.show
      )
        .post('/', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Banner About'),
          cleanSysCol(),
          controller.create
        )
        .put('/:id',
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Banner About'),
          cleanSysCol(),
          controller.update
        )
        .delete('/:id', 
          hasRoles([roles.SUPER_ADMIN]),
          hasScreen('Banner About'),
          controller.del
        )

        .get('/public/index', parseReq(), controller.index);
  return _router;
}

export default {
  router
};