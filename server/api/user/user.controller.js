import { wrapAsync, apiError } from "../../services";
import { tableNames, roles } from '../../../config/constant';
import knexnest from 'knexnest';
import { makeSalt, encryptPassword, authenticate } from "../../auth/auth.service";
import * as pagination from "../../services/pagination";

let db; 
export const initDbConnection = (dbConnection) => { db = dbConnection };
export const index = wrapAsync(async (req, res) => {
  await pagination.total(req, res, db(`${tableNames.USER}`));
  let result = await knexnest(pagination.query(req, res, db(`${tableNames.USER} AS user`)
    .innerJoin(`${tableNames.ROLE} as role`, 'role.id', 'user.roleId')
    .select(
      'user.id AS _id',
      'user.name AS _name',
      'user.username AS _username',
      'user.contact AS _contact',
      'user.email AS _email',
      'user.address AS _address',
      'role.name AS _role_name',
      'user.isActive as _isActive',
      'dateCreated as _dateCreated',
      'createdBy as _createdBy',
      'dateModified as _dateModified',
      'modifiedBy as _modifiedBy'
    ), col => {
      if(['id', 'name', 'username', 'email', 'contact'].indexOf(col) >= 0) return `user.${col}`;
      if(['role'].indexOf(col) >= 0) return `role.name`;
      return col
    }
  ))

  return result || [];
})

export const create = wrapAsync( async req => {
  let { name, username, email, contact, address, password,  roleId, createdBy, dateCreated } = req.body;
  let salt = makeSalt();
  let user = { 
    name, username, salt, email, contact, address, roleId, 
    hashedPassword: encryptPassword(password, salt),
    createdBy, dateCreated
  };

  let userId = await db(tableNames.USER).insert(user).returning('id');
  
  let result = await knexnest(db(`${tableNames.USER} AS user`)
    .leftJoin(`${tableNames.ROLE} as role`, 'role.id', 'user.roleId')
    .where({'user.id': userId[0]})
    .select(
      'user.id AS _id',
      'user.name AS _name',
      'user.username AS _username',
      'user.contact AS _contact',
      'user.email AS _email',
      'user.address AS _address',
      'role.name AS _role_name',
      'user.isActive as _isActive',
      'dateCreated as _dateCreated',
      'createdBy as _createdBy',
      'dateModified as _dateModified',
      'modifiedBy as _modifiedBy'
    )
  )

  return result[0];
})

export const update = wrapAsync( async req => {
  let { name, roleId, contact, email, address, isActive, modifiedBy, modifiedAt } = req.body;
  let {id} = req.params;
  let filter = req.user.role.name === 'SUPER_ADMIN' ? {id} : {id, 'createdBy': req.user.username};
  await db(tableNames.USER)
    .where(filter)
    .update({ name, roleId, contact, email, address, isActive, modifiedBy, modifiedAt });

  let result = await knexnest(db(`${tableNames.USER} AS user`)
    .innerJoin(`${tableNames.ROLE} as role`, 'role.id', 'user.roleId')
    .where({'user.id':id})
    .select(
      'user.id AS _id',
      'user.name AS _name',
      'user.username AS _username',
      'user.contact AS _contact',
      'user.email AS _email',
      'role.name AS _role_name',
      'user.isActive as _isActive',
      'dateCreated as _dateCreated',
      'createdBy as _createdBy',
      'dateModified as _dateModified',
      'modifiedBy as _modifiedBy'
    ))

  return result[0];
})

export const del = wrapAsync( async req => {
  await db(tableNames.USER)
    .where({id: req.params.id})
    .del()
  return 'success';
})

export const changePassword = wrapAsync(async (req, res) => {
    let userId;

    if(req.user.role.name === roles.SUPER_ADMIN){
        userId = req.params.id
    } else {
        userId = req.user.id;
    }


    const oldPass = String(req.body.oldPassword);
    const newPass = String(req.body.newPassword);
    const confirmPass = String(req.body.confirmPassword);


    if(newPass.length < 6 || newPass.length > 15) throw new Error('Password is must at least min 6 & max 15 characters');
    if(newPass !== confirmPass) throw new Error("Password and confirm password didn't match");

    const user = await db(tableNames.USER).select('*').where({id:userId}).first();
    if(!user) throw new apiError('User is not found', 404);

    const salt = makeSalt();
    const hashedPassword = encryptPassword(newPass, salt);

    // if(req.user.id !== userId && req.user.role.name === roles.SUPER_ADMIN) {
    //   await db(tableNames.USER).where({id:userId}).update({salt, hashedPassword})
    //   return 'ok'
    // } else {
        if(authenticate(oldPass, user.salt, user.hashedPassword)) {
            await db(tableNames.USER).where({id:userId}).update({salt, hashedPassword})
            return 'ok'
        } else {
            throw new Error('Forbidden, wrong current password')
        }
    // }
});