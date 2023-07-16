import express from 'express';
import * as controller from './user.controller';
import { isAuthenticated, hasRoles, checkingAuth } from '../../auth/auth.service';
import { roles } from '../../../config/constant';

const router = db => {
  controller.initDbConnection(db);
  let _router = new express.Router
      _router
        .get('/', hasRoles([roles.SUPER_ADMIN]), controller.index)
        .post('/', hasRoles([roles.SUPER_ADMIN]), controller.create)
        .put('/:id', hasRoles([roles.SUPER_ADMIN]), controller.update)
        .delete('/:id', hasRoles([roles.SUPER_ADMIN]), controller.del)
        .put('/:id/change-password', checkingAuth(true), controller.changePassword);
  return _router;
}

export default {
  router
};