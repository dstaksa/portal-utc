import express from 'express';
import * as controller from './role.controller';
import { hasRoles } from '../../auth/auth.service';
import { roles } from '../../../config/constant';

const router = db => {
  controller.initDbConnection(db);
  let _router = new express.Router
      _router
        .get('/', hasRoles([roles.SUPER_ADMIN]), controller.index)
  return _router;
}

export default {
  router
};