import express from 'express';
import * as controller from './partner.controller';
import { hasRoles, cleanSysCol, hasScreen } from '../../auth/auth.service';
import { roles } from '../../../config/constant';
import multer from 'multer';
import env from '../../../config/environment';

const { baseUri, sub } = env.path.upload;

const router = db => {
  controller.initDbConnection(db);
  let _router = new express.Router
      _router
        .get('/', 
          hasRoles([roles.SUPER_ADMIN]),
          hasScreen('Partner'),
          controller.index
          )
        .get('/:id', 
          hasRoles([roles.SUPER_ADMIN]),
          hasScreen('Partner'),
          controller.show
          )
        .post('/', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Partner'),
          multer({dest:`${baseUri}${sub.partner}`}).single('file'),
          cleanSysCol(),
          controller.create)
        .put('/:id', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Partner'),
          multer({dest:`${baseUri}${sub.partner}`}).single('file'),
          cleanSysCol(),
          controller.update
        )
        .delete('/:id', 
          hasRoles([roles.SUPER_ADMIN]), 
          hasScreen('Partner'),
          controller.del
        )

        .get('/public/index', controller.index)
        .get('/public/show/:id', controller.show)
  return _router;
}

export default {
  router
};